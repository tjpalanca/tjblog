FROM rocker/geospatial:3.6.1
LABEL maintainer="TJ Palanca <mail@tjpalanca.com>"

# Install nginx
USER root
RUN apt-get update && apt-get install -y nginx

# Use CRAN instead of checkpointed library
RUN echo "\
    options(repos = c(CRAN = 'https://cran.rstudio.com/'), \
    download.file.method = 'libcurl')" >> /usr/local/lib/R/etc/Rprofile.site

# R Packages
RUN install2.r distill nomnoml emojifont

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
