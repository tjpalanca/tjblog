library(stringr)
library(tibble)
library(dplyr)
library(lubridate)
library(glue)
library(purrr)
library(readr)

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
      }
    )
  )

file.copy(
    "~/workspace/tjpalanca.com/static/img/posts/20120419-pale-blue-dot.jpeg",
    "_posts/2012-04-19-on-mans-insignificance/images/pale-blue-dot.jpeg"
)
