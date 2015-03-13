require "rubygems"
require "bundler/setup"
require "stringex"
## -- Config -- ##

ssh_user       = "thesp0nge@goliath.armoredcode.com"
ssh_port       = "22"
document_root  =  "/var/www/codiceinsicuro.it"
rsync_delete   = true
deploy_default = "rsync"
public_dir      = "_site"    # compiled site directory

deploy_dir      = "_site"
posts_dir       = "_posts"    # directory for blog files
new_post_ext    = "md"  # default new post file extension when using the new_post task
new_page_ext    = "md"  # default new page file extension when using the new_page task

deploy_dir      = "_site"
source_dir      = "_source"
draft_dir       = "_drafts"

css_output_dir  = "#{deploy_dir}/stylesheets"
less_dir        = "#{source_dir}/assets/less"
image_dir       = "#{source_dir}/images"

#############################
# Create a new Post or Page #
#############################

namespace :new do

desc "Create a new draft in #{draft_dir}"
task :draft, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{draft_dir}/#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  category = get_stdin("Enter category name to group your post in (pick'n'chic, sicurina, doctor is in, l'angolo del libro, spinaci, meditazione, chiacchiere da pub): ")
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, category, tags)
end

desc "Create a new under-attack post ( storie di vulnerabilità ed exploit ) in #{posts_dir}"
task :under, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Under attack", tags)
end

desc "Create a new sicurina post ( pillole per scrivere codice più sicuro ) in #{posts_dir}"
task :sicurina, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Sicurina", tags)
end

desc "Create a new doctor is in post (lo sportello dell’awareness) in #{posts_dir}"
task :doctor, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Doctor is in", tags)
end

desc "Create a new l'angolo del libro post in #{posts_dir}"
task :libro, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "L'angolo del libro", tags)
end

desc "Create a new spinaci post (storie di hardening) in #{posts_dir}"
task :spinaci, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Spinaci", tags)
end

desc "Create a new meditazione post  in #{posts_dir}"
task :meditazione, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Meditazione", tags)
end

desc "Create a new chiacchieree post in #{posts_dir}"
task :chiacchiere, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Chiacchiere da bar", tags)
end

desc "Create a new pick'n'chic post (usare ruby in un penetration test applicativo) in #{posts_dir}"
task :pick, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, "Pick'n'chic", tags)
end


# usage rake new_post
desc "Create a new post in #{posts_dir}"
task :post, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your post: ")
  end
  filename = "#{posts_dir}/#{Time.now.strftime('%Y-%m-%d')}-#{title.to_url}.#{new_post_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  category = get_stdin("Enter category name to group your post in (pick'n'chic, sicurina, doctor is in, l'angolo del libro, spinaci, meditazione, chiacchiere da pub): ")
  tags = get_stdin("Enter tags to classify your post (comma separated): ")
  create_post(filename, title, category, tags)
end

# usage rake new_page
desc "Create a new page"
task :page, :title do |t, args|
  if args.title
    title = args.title
  else
    title = get_stdin("Enter a title for your page: ")
  end
  filename = "#{title.to_url}.#{new_page_ext}"
  if File.exist?(filename)
    abort("rake aborted!") if ask("#{filename} already exists. Do you want to overwrite?", ['y', 'n']) == 'n'
  end
  tags = get_stdin("Enter tags to classify your page (comma separated): ")
  puts "Creating new page: #{filename}"
  open(filename, 'w') do |page|
    page.puts "---"
    page.puts "layout: page"
    page.puts "permalink: /#{title.to_url}/"
    page.puts "title: \"#{title}\""
    page.puts "modified: #{Time.now.strftime('%Y-%m-%d %H:%M')}"
    page.puts "tags: [#{tags}]"
    page.puts "image:"
    page.puts "  feature:"
    page.puts "  credit:"
    page.puts "  creditlink:"
    page.puts "share: true"
    page.puts "---"
  end
end
end


def create_post(filename, title, category, tags)
  puts "Creating new post: #{filename}"
  open(filename, 'w') do |post|
    post.puts "---"
    post.puts "layout: post"
    post.puts "title: \"#{title.gsub(/&/,'&amp;')}\""
    post.puts "promotion: "
    post.puts "modified: "
    post.puts "category: [#{category}]"
    post.puts "tags: [#{tags}]"
    post.puts "image:"
    post.puts "  feature:"
    post.puts "  credit:"
    post.puts "  creditlink:"
    post.puts "comments: true"
    post.puts "share: true"
    post.puts "---"
  end
end
def get_stdin(message)
  print message
  STDIN.gets.chomp
end

def ask(message, valid_options)
  if valid_options
    answer = get_stdin("#{message} #{valid_options.to_s.gsub(/"/, '').gsub(/, /,'/')} ") while !valid_options.include?(answer)
  else
    answer = get_stdin(message)
  end
  answer
end

namespace :blog do
  desc "Deploy website via rsync"
  task :rsync do
    exclude = ""
    if File.exists?('./rsync-exclude')
      exclude = "--exclude-from '#{File.expand_path('./rsync-exclude')}'"
    end
    puts "## Deploying website via Rsync"
    system("rsync -avze 'ssh -p #{ssh_port}' #{exclude} #{"--delete" unless rsync_delete == false} #{deploy_dir}/ #{ssh_user}:#{document_root}")
  end

  desc "Generate jekyll site"
  task :generate do
    puts "## Generating Site with Jekyll"
    system "jekyll build"
  end
end
