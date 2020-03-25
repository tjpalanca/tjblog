library(stringr)
library(tibble)
library(dplyr)
library(lubridate)
library(glue)
library(purrr)
library(readr)
library(magrittr)

template <- '
<!DOCTYPE html>
<html>
<head>
   <meta http-equiv="refresh"
   content="0; url=../../{new_url}/">
</head>
<body>
   <p>
      The page has moved to
      <a href="../../{new_url}/">here.</a>
   </p>
</body>
</html>
'

list.dirs("_posts", recursive = FALSE) %>%
  tibble(post_dir = .) %>%
  mutate(
    new_url = str_replace(post_dir, "^\\_posts/", "posts/"),
    date    = as_date(str_extract(new_url, "[0-9]{4}-[0-9]{2}-[0-9]{2}")),
    old_dir = paste0(
      year(date), "/",
      str_pad(month(date), 2, pad = "0")
    ),
    old_url = paste0(
      old_dir, "/",
      str_extract(new_url, "[0-9]{4}-[0-9]{2}-[0-9]{2}-.*") %>%
        str_replace("[0-9]{4}-[0-9]{2}-[0-9]{2}-", ""),
      ".html"
    ),
    redirect_html = glue(template)
  ) %>%
  mutate(
    redirect_written = pmap(
      list(redirect_html, old_url, old_dir),
      function(redirect_html, old_url, old_dir) {
        dir.create(old_dir, recursive = TRUE)
        write_file(
          x = redirect_html,
          path = old_url
        )
      }
    )
  )

post_data <-
  list.files(
    path    = "~/workspace/tjpalanca.com/content/blog/",
    pattern = "\\.[R]*md$"
  ) %>%
  tibble(old_post = .) %>%
  mutate(
    date = old_post %>%
      str_extract("[0-9]{4}-[0-9]{2}-[0-9]{2}") %>%
      as_date(),
    slug = old_post %>%
      str_replace("[0-9]{4}-[0-9]{2}-[0-9]{2}-", "") %>%
      str_replace("\\..*$", "")
  ) %>%
  mutate(
    created_post = map2(
      date, slug,
      function(date, slug) {
        post_exists <- dir.exists(paste0("_posts/", date, "-", slug))
        if (!post_exists) {
          create_post(
            title = slug,
            slug = slug,
            date_prefix = date,
            edit = FALSE
          )
        }
        images_dir <- paste0("_posts/", date, "-", slug, "/images")
        images_dir_exists <- dir.exists(images_dir)
        if (!images_dir_exists) {
          dir.create(images_dir)
        }

      }
    )
  )
nrow(post_data)


copy_image <- function(image_path) {
  file.copy(
    paste0(
      "~/workspace/tjpalanca.com/static/",
      image_path
    ),
    paste0(
      "_posts/",
      post_data$date[post_number], "-",
      post_data$slug[post_number], "/images"
    )
  )
}

open_post <- function() {
  old_post_loc <- paste0("~/workspace/tjpalanca.com/content/blog/",
                         post_data$old_post[post_number])
  new_post_loc <- paste0("_posts/",
                         post_data$date[post_number], "-",
                         post_data$slug[post_number], "/",
                         post_data$slug[post_number], ".Rmd")
  old_post_yaml <- rmarkdown::yaml_front_matter(old_post_loc)
  new_post_content <- read_lines(new_post_loc)
  old_post_content <- read_lines(old_post_loc)
  if (!is.null(old_post_yaml$title)) {
    if (!is.null(old_post_yaml$subtitle)) {
      subtitle <- paste0(": ", old_post_yaml$subtitle)
    } else {
      subtitle <- ""
    }
    new_post_title <- which(str_detect(new_post_content, "title: "))
    new_post_content[new_post_title] <-
      paste0("title: \"", old_post_yaml$title, subtitle, "\"")
  }
  if (!is.null(old_post_yaml$excerpt)) {
    new_post_desc <- which(str_detect(new_post_content, "^description: "))
    new_post_content[new_post_desc] <-
      paste0("description: \"", old_post_yaml$excerpt, "\"")
    new_post_content[new_post_desc + 1] <- ""
  }
  new_post_matter <- which(new_post_content == "---")[2]
  old_post_matter <- which(old_post_content == "---")[2]
  if (!is.null(old_post_yaml$tags)) {
    new_post_content[new_post_matter] <- paste0(
      old_post_yaml$tags %>%
        { glue("  - {.}") } %>%
        glue_collapse(sep = "\n") %>%
        { glue("categories:\n{.}") },
      "\n", new_post_content[new_post_matter]
    )
  }
  if (!is.null(old_post_yaml$meta_img)) {
    copy_image(old_post_yaml$meta_img)
    new_post_content[new_post_matter] <- paste0(
      old_post_yaml$meta_img %>%
        str_replace("^/img/posts/", "") %>% {
          glue("preview: images/{.}")
        },
      "\n", new_post_content[new_post_matter]
    )
  }
  new_post_content <- append(
    new_post_content[1:new_post_matter],
    old_post_content[(old_post_matter + 1):length(old_post_content)]
  )
  images <-
    new_post_content %>%
    glue_collapse("\n") %>%
    str_extract_all("\\\"/img/.*?\\\"") %>%
    extract2(1)
  if (length(images) > 0) {
    images %>%
      str_replace_all("\"", "") %>%
      map(copy_image)
  }
  figures <- which(str_detect(new_post_content, "< figure.*"))
  figures_data <-
    new_post_content[figures] %>%
    tibble(figure = .) %>%
    mutate(
      old_src = figure %>%
        str_extract("src=\".*?\"") %>%
        str_replace_all("src=\"|\"", ""),
      new_src = old_src %>%
        str_replace("/img/posts/", "images/"),
      caption = figure %>%
        str_extract("caption=\".*?\"") %>%
        str_replace_all("caption=\"|\"", ""),
      width = figure %>%
        str_extract("width=\".*?\"") %>%
        str_replace_all("width=\"|\"", ""),
      r_chunk = pmap_chr(
        list(new_src, caption, width),
        function(new_src, caption, width) {
          if (!is.na(caption) & !is.na(width)) {
            paste0(
              "```{r fig.cap=\"", caption, "\", out.width=\"", width, "\"}\n",
              "knitr::include_graphics(\"", new_src, "\")\n",
              "```"
            )
          } else if (!is.na(caption)) {
            paste0(
              "```{r fig.cap=\"", caption, "\"}\n",
              "knitr::include_graphics(\"", new_src, "\")\n",
              "```"
            )
          } else if (!is.na(width)) {
            paste0(
              "```{r out.width=\"", width, "\"}\n",
              "knitr::include_graphics(\"", new_src, "\")\n",
              "```"
            )
          } else {
            paste0(
              "```{r}\n",
              "knitr::include_graphics(\"", new_src, "\")\n",
              "```"
            )
          }
        }
      )
    )
  for (figure_num in 1:length(figures)) {
    new_post_content[figures[figure_num]] <- figures_data$r_chunk[figure_num]
  }
  write_lines(new_post_content, new_post_loc)
  file.edit(old_post_loc)
  file.edit(new_post_loc)
}

post_number <- 40
post_data$old_post[post_number]
open_post()
copy_image("img/posts/20130612-turkey-bloody-friday.jpg")
