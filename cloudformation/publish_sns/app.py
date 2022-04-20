import boto3
import os
import json
from botocore.exceptions import ClientError
from urllib.parse import urlparse
from aws_lambda_powertools import Logger
import urllib.parse

logger = Logger()


s3_client = boto3.client('s3')
sns_client = boto3.client('sns')

SNS_TOPIC_ARN = os.environ['TOPIC_ARN']


def create_presigned_url(bucket_name, object_name, expiration=600000):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        logger.error(e)
        return None

    # The response contains the presigned URL
    return response


def lambda_handler(event, context):
    logger.info("Received event: " + json.dumps(event, indent=2))

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(
        event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    presigned = create_presigned_url(bucket, key)

    logger.info(presigned)

    response = sns_client.publish(
        TargetArn=SNS_TOPIC_ARN,
        Message=json.dumps({'default': presigned}),
        MessageStructure='json'
    )

    logger.info(response)

    return
