aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 822248934593.dkr.ecr.us-west-2.amazonaws.com

docker build -t notifications -f apps/notifications/Dockerfile .
docker build -t payments -f apps/payments/Dockerfile .
docker build -t notifications -f apps/notifications/Dockerfile .
docker build -t auth -f apps/auth/Dockerfile .

docker tag notifications:latest 822248934593.dkr.ecr.us-west-2.amazonaws.com/notifications:latest
docker tag payments:latest 822248934593.dkr.ecr.us-west-2.amazonaws.com/payments:latest
docker tag notifications:latest 822248934593.dkr.ecr.us-west-2.amazonaws.com/notifications:latest
docker tag auth:latest 822248934593.dkr.ecr.us-west-2.amazonaws.com/auth:latest

docker push 822248934593.dkr.ecr.us-west-2.amazonaws.com/notifications:latest
docker push 822248934593.dkr.ecr.us-west-2.amazonaws.com/payments:latest
docker push 822248934593.dkr.ecr.us-west-2.amazonaws.com/notifications:latest
docker push 822248934593.dkr.ecr.us-west-2.amazonaws.com/auth:latest
