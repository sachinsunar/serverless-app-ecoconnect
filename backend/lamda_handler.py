#----eco-connect backend - lambda handler----
import json
import logging
import boto3
import uuid
import os
from decimal import Decimal
from datetime import datetime
from boto3.dynamodb.conditions import Key

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")

BUSINESS_TABLE = dynamodb.Table("Businesses")
REVIEW_TABLE = dynamodb.Table("BusinessReviews")
cognito = boto3.client("cognito-idp")


# ------------------ Helpers ------------------

def cors_headers():
    return {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Authorization,Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
    }


def response(status, body):
    return {
        "statusCode": status,
        "headers": cors_headers(),
        "body": json.dumps(body, default=str)
    }


def get_claims(event):
    return event.get("requestContext", {}).get("authorizer", {}).get("claims", {})


def is_superadmin(claims):
    groups = claims.get("cognito:groups", [])

    if isinstance(groups, str):
        groups = groups.split(",")

    return "superadmin" in groups


def utc_now():
    return datetime.utcnow().isoformat()


def parse_body(event):
    try:
        return json.loads(event.get("body") or "{}")
    except (json.JSONDecodeError, TypeError):
        return {}


def query_all(table, key_condition):
    items = []
    last_key = None
    while True:
        kwargs = {"KeyConditionExpression": key_condition}
        if last_key:
            kwargs["ExclusiveStartKey"] = last_key
        res = table.query(**kwargs)
        items.extend(res.get("Items", []))
        last_key = res.get("LastEvaluatedKey")
        if not last_key:
            break
    return items


#------------ Dashboard data------------ 

def get_dashboard_data(claims):
    if not claims:
        return response(401, {"error": "Unauthorized"})

    if not is_superadmin(claims):
        return response(403, {"error": "Only superadmin can access dashboard"})

    # total businesses
    business_res = BUSINESS_TABLE.scan(Select="COUNT")
    total_businesses = business_res.get("Count", 0)

    # total reviews
    review_res = REVIEW_TABLE.scan(Select="COUNT")
    total_reviews = review_res.get("Count", 0)

    # total users (from cognito)
    user_pool_id = os.environ.get("USER_POOL_ID")
    total_users = 0

    pagination_token = None
    while True:
        kwargs = {"UserPoolId": user_pool_id, "Limit": 60}
        if pagination_token:
            kwargs["PaginationToken"] = pagination_token

        res = cognito.list_users(**kwargs)
        total_users += len(res.get("Users", []))

        pagination_token = res.get("PaginationToken")
        if not pagination_token:
            break

    return response(200, {
        "totalBusinesses": total_businesses,
        "totalUsers": total_users,
        "totalReviews": total_reviews
    })


# ------------------ Business CRUD ------------------


# ------------------ Get All Businesses ------------------
def get_all_businesses(event):

    params = event.get("queryStringParameters") or {}
    limit = min(int(params.get("limit", 50)), 100)  

    kwargs = {"Limit": limit}
    last_key = params.get("lastKey")
    if last_key:
        kwargs["ExclusiveStartKey"] = {"businessId": last_key}

    res = BUSINESS_TABLE.scan(**kwargs)

    last_evaluated = res.get("LastEvaluatedKey")

    return response(200, {
        "businesses": res.get("Items", []),
        "lastKey": last_evaluated.get("businessId") if last_evaluated else None
    })


# ------------------ Get Business by ID ------------------
def get_business(business_id):
    res = BUSINESS_TABLE.get_item(Key={"businessId": business_id})
    item = res.get("Item")

    if not item:
        return response(404, {"error": "Business not found"})

    return response(200, {"business": item})


# ------------------ Create Business ------------------
def create_business(event, claims):
    if not is_superadmin(claims):
        return response(403, {"error": "Only superadmin can create businesses"})

    body = parse_body(event)

    if not body.get("name"):
        return response(400, {"error": "name is required"})
    if not body.get("category"):
        return response(400, {"error": "category is required"})
    if not body.get("location"):
        return response(400, {"error": "location is required"})
    if not body.get("image"):
        return response(400, {"error": "image url is required"})

    if len(body["name"]) > 200:
        return response(400, {"error": "name must be 200 characters or fewer"})
    if len(body.get("description", "")) > 2000:
        return response(400, {"error": "description must be 2000 characters or fewer"})

    business_id = str(uuid.uuid4())

    item = {
        "businessId": business_id,
        "name": body["name"],
        "description": body.get("description", ""),
        "category": body["category"],
        "location": body["location"],
        "image": body["image"],
        "ratingSum": 0,
        "totalReviews": 0,
        "createdAt": utc_now(),
        "updatedAt": utc_now()
    }

    BUSINESS_TABLE.put_item(Item=item)
    logger.info(f"Business created: {business_id}")
    return response(201, {"message": "Business created", "business": item})


# ------------------ Update Business ------------------
def update_business(event, claims, business_id):
    if not is_superadmin(claims):
        return response(403, {"error": "Only superadmin can update businesses"})

    body = parse_body(event)

    allowed_fields = ["name", "description", "location", "image", "category"]

    if "name" in body and len(body["name"]) > 200:
        return response(400, {"error": "name must be 200 characters or fewer"})
    if "description" in body and len(body["description"]) > 2000:
        return response(400, {"error": "description must be 2000 characters or fewer"})

    update_parts = []
    values = {}
    names = {}

    for field in allowed_fields:
        if field in body:
            update_parts.append(f"#{field} = :{field}")
            values[f":{field}"] = body[field]
            names[f"#{field}"] = field

    if not update_parts:
        return response(400, {"error": "Nothing to update"})

    update_parts.append("#updatedAt = :updatedAt")
    values[":updatedAt"] = utc_now()
    names["#updatedAt"] = "updatedAt"

    BUSINESS_TABLE.update_item(
        Key={"businessId": business_id},
        UpdateExpression="SET " + ", ".join(update_parts),
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names
    )

    logger.info(f"Business updated: {business_id}")
    return response(200, {"message": "Business updated"})


# ------------------ Delete Business ------------------
def delete_business(claims, business_id):
    if not is_superadmin(claims):
        return response(403, {"error": "Only superadmin can delete businesses"})

    BUSINESS_TABLE.delete_item(Key={"businessId": business_id})

    reviews = query_all(REVIEW_TABLE, Key("businessId").eq(business_id))

    for r in reviews:
        REVIEW_TABLE.delete_item(
            Key={"businessId": business_id, "userId": r["userId"]}
        )

    logger.info(f"Business deleted: {business_id}, reviews deleted: {len(reviews)}")
    return response(200, {"message": "Business deleted"})


# ------------------ Reviews CRUD ------------------


# ------------------ Get Reviews ------------------
def get_reviews(business_id):
    reviews = query_all(REVIEW_TABLE, Key("businessId").eq(business_id))
    return response(200, {"reviews": reviews})


# ------------------ Update Review Stats ------------------
def update_review_stats(business_id, rating):
    BUSINESS_TABLE.update_item(
        Key={"businessId": business_id},
        UpdateExpression="ADD totalReviews :one, ratingSum :r SET updatedAt = :u",
        ExpressionAttributeValues={
            ":one": 1,
            ":r": Decimal(str(rating)),
            ":u": utc_now()
        }
    )


# ------------------ Create Review ------------------
def add_review(event, claims, business_id):
    if not claims:
        return response(401, {"error": "Unauthorized"})

    if is_superadmin(claims):
        return response(403, {"error": "Superadmin cannot post reviews"})

    user_id = claims.get("sub")
    body = parse_body(event)

    rating = body.get("rating")
    comment = body.get("comment", "")

    if rating is None:
        return response(400, {"error": "rating is required"})

    rating = int(rating)
    if rating < 1 or rating > 5:
        return response(400, {"error": "rating must be between 1 and 5"})

    if len(comment) > 1000:
        return response(400, {"error": "comment must be 1000 characters or fewer"})

    business_check = BUSINESS_TABLE.get_item(Key={"businessId": business_id})
    if "Item" not in business_check:
        return response(404, {"error": "Business not found"})

    existing = REVIEW_TABLE.get_item(
        Key={"businessId": business_id, "userId": user_id}
    )
    if "Item" in existing:
        return response(409, {"error": "You have already reviewed this business"})

    review_item = {
        "businessId": business_id,
        "businessName": business_check["Item"]["name"],
        "userId": user_id,
        "userName": claims.get("name"),
        "rating": rating,
        "comment": comment,
        "createdAt": utc_now()
    }

    REVIEW_TABLE.put_item(Item=review_item)

    update_review_stats(business_id, rating)

    logger.info(f"Review added by {user_id} for business {business_id}")
    return response(201, {"message": "Review added", "review": review_item})


# ------------------ Update Review ------------------
def update_review(event, claims, business_id):
    if not claims:
        return response(401, {"error": "Unauthorized"})

    if is_superadmin(claims):
        return response(403, {"error": "Superadmin cannot update reviews"})

    user_id = claims.get("sub")
    body = parse_body(event)

    rating = body.get("rating")
    comment = body.get("comment")

    if rating is None and comment is None:
        return response(400, {"error": "Nothing to update"})

    existing = REVIEW_TABLE.get_item(
        Key={"businessId": business_id, "userId": user_id}
    )

    if "Item" not in existing:
        return response(404, {"error": "Review not found"})

    old_rating = int(existing["Item"]["rating"])

    update_parts = []
    values = {}
    names = {}

    new_rating = None

    if rating is not None:
        new_rating = int(rating)
        if new_rating < 1 or new_rating > 5:
            return response(400, {"error": "rating must be between 1 and 5"})

        update_parts.append("rating = :r")
        values[":r"] = new_rating

    if comment is not None:
        if len(comment) > 1000:
            return response(400, {"error": "comment must be 1000 characters or fewer"})

        update_parts.append("#c = :c")
        values[":c"] = comment
        names["#c"] = "comment"

    REVIEW_TABLE.update_item(
        Key={"businessId": business_id, "userId": user_id},
        UpdateExpression="SET " + ", ".join(update_parts),
        ExpressionAttributeValues=values,
        ExpressionAttributeNames=names if names else None
    )

    # Update ratingSum if rating changed
    if new_rating is not None and new_rating != old_rating:
        diff = new_rating - old_rating
        BUSINESS_TABLE.update_item(
            Key={"businessId": business_id},
            UpdateExpression="ADD ratingSum :diff SET updatedAt = :u",
            ExpressionAttributeValues={
                ":diff": Decimal(str(diff)),
                ":u": utc_now()
            }
        )

    return response(200, {"message": "Review updated"})


# ------------------ Delete Review ------------------
def delete_review(claims, business_id):
    if not claims:
        return response(401, {"error": "Unauthorized"})

    if is_superadmin(claims):
        return response(403, {"error": "Superadmin cannot delete reviews"})

    user_id = claims.get("sub")

    existing = REVIEW_TABLE.get_item(
        Key={"businessId": business_id, "userId": user_id}
    )

    if "Item" not in existing:
        return response(404, {"error": "Review not found"})

    old_rating = int(existing["Item"]["rating"])

    # delete review
    REVIEW_TABLE.delete_item(
        Key={"businessId": business_id, "userId": user_id}
    )

    # update business stats
    BUSINESS_TABLE.update_item(
        Key={"businessId": business_id},
        UpdateExpression="ADD totalReviews :minusOne, ratingSum :minusRating SET updatedAt = :u",
        ExpressionAttributeValues={
            ":minusOne": -1,
            ":minusRating": Decimal(str(-old_rating)),
            ":u": utc_now()
        }
    )

    return response(200, {"message": "Review deleted"})


# ------------------ Delete Review by Admin ------------------
def delete_review_by_admin(claims, business_id, target_user_id):
    if not claims:
        return response(401, {"error": "Unauthorized"})

    if not is_superadmin(claims):
        return response(403, {"error": "Only superadmin can delete other users reviews"})

    existing = REVIEW_TABLE.get_item(
        Key={"businessId": business_id, "userId": target_user_id}
    )

    if "Item" not in existing:
        return response(404, {"error": "Review not found"})

    old_rating = int(existing["Item"]["rating"])

    REVIEW_TABLE.delete_item(
        Key={"businessId": business_id, "userId": target_user_id}
    )

    BUSINESS_TABLE.update_item(
        Key={"businessId": business_id},
        UpdateExpression="ADD totalReviews :minusOne, ratingSum :minusRating SET updatedAt = :u",
        ExpressionAttributeValues={
            ":minusOne": -1,
            ":minusRating": Decimal(str(-old_rating)),
            ":u": utc_now()
        }
    )

    return response(200, {"message": "Review deleted by superadmin"})


# ------------------ Main Lambda Handler ------------------

def lambda_handler(event, context):
    method = event.get("httpMethod")
    path = event.get("resource")
    claims = get_claims(event)

    logger.info(f"Request: {method} {path}")

# ------------ CORS preflight ---------------------------
    if method == "OPTIONS":
        return response(200, {})

    path_params = event.get("pathParameters") or {}
    business_id = path_params.get("id")

# ------------ Businesses Routing -------------------------
    if path == "/businesses" and method == "GET":
        return get_all_businesses(event)

    if path == "/businesses" and method == "POST":
        return create_business(event, claims)

    if path == "/businesses/{id}" and method == "GET":
        return get_business(business_id)

    if path == "/businesses/{id}" and method == "PUT":
        return update_business(event, claims, business_id)

    if path == "/businesses/{id}" and method == "DELETE":
        return delete_business(claims, business_id)

#------------------- Reviews Routing ------------------------
    if path == "/businesses/{id}/reviews" and method == "GET":
        return get_reviews(business_id)

    if path == "/businesses/{id}/reviews" and method == "POST":
        return add_review(event, claims, business_id)

    if path == "/businesses/{id}/reviews" and method == "PUT":
        return update_review(event, claims, business_id)

    if path == "/businesses/{id}/reviews" and method == "DELETE":
        return delete_review(claims, business_id)   
    
    userId = path_params.get("userId")

    if path == "/businesses/{id}/reviews/{userId}" and method == "DELETE":
        return delete_review_by_admin(claims, business_id, userId)

#------------------- Dashboard Stat Routing ------------------------
    if path == "/dashboard" and method == "GET":
        return get_dashboard_data(claims)
    

    return response(404, {"error": "Route not found"})