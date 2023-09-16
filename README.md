# costwise-aws-pricing-api

This Backend Service helps in retrieving the information of AWS Services currently running.
The information includes the pricing, description of the service and other metadata of the AWS Services.
In total there are 218 services that are currently live on AWS with over 200,000 SKUs.

# Live Link to test the APIs
https://q68hkeuim4.us-east-1.awsapprunner.com 
It is hosted on AWS using AWS AppRunner Service

# Database
The Database used is **MySQL**
I have Self - Hosted this MySQL DB on AWS EC2 instance.
1. **DB Name** - AWS_SERVICES
2. **Tables** - aws_services_metadata AND aws_services_pricing
3. **Schema of MetaData Table**
sku : varchar(255) PK 
location : varchar(255) 
region_code: varchar(255) 
usageType: varchar(255) 
serviceName: varchar(255) 
serviceCode: varchar(255)
4. **Schema of Pricing Table**
id: int AI PK 
service_type: varchar(255) 
sku: varchar(255) PK 
rateCode: varchar(255) 
description: varchar(255) 
beginRange: varchar(255) 
endRange: varchar(255) 
unit: varchar(255) 
pricePerUnit: decimal(20,9) 
effectiveDate: date
    
![image](https://github.com/palnikhil/costwise-aws-pricing-api/assets/85008177/1e72342b-80a9-4fac-af97-2bffa9146c13)

# PostMan Request Examples 
![image](https://github.com/palnikhil/costwise-aws-pricing-api/assets/85008177/b1176153-b3e7-4e6c-9323-40bd530a95e2)

# Along with that 
There are several filters:
1. sku
2. location
3. serviceName
4. serviceCode
5. region_code

# Sample API request to Test
1. https://q68hkeuim4.us-east-1.awsapprunner.com/db/get?limit=1000&region_code=ca-central-1&serviceCode=comprehend (GET)
2. https://q68hkeuim4.us-east-1.awsapprunner.com/db/get?limit=1000&serviceCode=ContactCenterTelecomm (GET)

# Scope of Work(Future)
SNS Service to auto update the Prices in MySQL.
