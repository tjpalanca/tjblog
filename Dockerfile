FROM tjpalanca/apps:tjutils-v0.5.0
LABEL maintainer="TJ Palanca <mail@tjpalanca.com>"

# Install nginx
USER root
RUN apt-get update && apt-get install -y nginx

# R Packages
RUN install2.r distill nomnoml emojifont
RUN Rscript -e "devtools::install_github('tjpalanca/data-art@v0.1.1', \
  dependencies = TRUE, upgrade = FALSE)"

# Create app working directory
RUN mkdir -p /src
WORKDIR /src

# Copy files over to the working directory
COPY . .

# Render site
RUN Rscript -e "rmarkdown::render_site(); rmarkdown::render('index.Rmd', output_dir='_site');"

# Command
RUN cp _nginx.conf /etc/nginx/nginx.conf
CMD ["/bin/bash", "-c", "/src/_deploy.sh"]
