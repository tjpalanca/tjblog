# Application Infromation
APP_REPO=tjpalanca/apps
APP_NAME=tjblog
APP_VERS=1.0.0

# Volumes
VOLUMES = \
	-v /mnt/data-store/home/tjpalanca/public/tjblog/:/home/public/tjblog/

# Calculated
NODENAME = $(shell kubectl get pod $(HOSTNAME) -o=jsonpath={'.spec.nodeName'})
REPO_VER=$(APP_REPO):$(APP_NAME)-$(APP_VERS)
REPO_LAT=$(APP_REPO):$(APP_NAME)-latest

# Pull docker image
docker-pull:
	docker pull $(REPO_LAT) && \
	docker pull $(REPO_VER)

# Builds the docker image for this particular version
docker-build:
	docker build \
		--cache-from=$(REPO_VER) \
		--cache-from=$(REPO_LAT) \
		-t $(REPO_VER) .

# Publishes the built docker image to Docker Hub
docker-publish:
	docker tag $(REPO_VER) $(REPO_LAT) && \
	docker push $(REPO_LAT) && \
	docker push $(REPO_VER)

# Bash into docker image
docker-shell:
	docker run -it --rm $(VOLUMES) $(REPO_VER) bash

# Docker deployment
docker-deploy:
	docker run -it --rm \
		$(VOLUMES) \
		$(REPO_VER) \
		/bin/bash -c "cp -r _site/* /home/public/tjblog"
