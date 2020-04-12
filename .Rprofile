# Libraries
require(distill)
require(magrittr)

# Create Notes
create_note <- function(...) {
  # Create the post
  old_post <- create_post(..., edit = FALSE, date_prefix = FALSE)
  old_dir  <- dirname(old_post)
  new_post <- gsub("\\_posts", "_notes", old_post)
  new_dir  <- dirname(new_post)
  # Create new directory
  dir.create(new_dir)
  # Transfer the Rmd document
  readr::read_lines(old_post) %>% {
    .[which(stringr::str_detect(., "^date:"))] <- "date: \"`r Sys.Date()`\""
    return(.)
  } %>%
    readr::write_lines(new_post, append = FALSE)
  # Delete the old dir
  unlink(old_dir, recursive = TRUE)
  # Open the new file
  file.edit(new_post)
}
