# buffer.rb - Share your latest post on buffer
#
# The original plugin is by Jason Fox and you can find it on his blog:
# http://www.neverstopbuilding.com/jekyll-buffer-plugin
#
# I (paolo@codiceinsicuro.it) just changed:
#   + generate_message to include site configuration for building an absolute
#     path for the post
#   + buffer to have all config keys on the same namespace and on a separate
#     file for access_token (name stored in config)
#

require 'buff'
require 'yaml'

class Buffer < Jekyll::Generator
  def generate(site)
    post = most_recent_post(site)
    post_date = post.date.strftime('%Y-%m-%d')
    today_date = Date.today.strftime('%Y-%m-%d')

    if post_date == today_date and ! site.config['url'].include?('http://localhost:4000')
      message = generate_message(post, site)
      log "Buffer message: \"#{message}\""
      buffer(message, site)
    else
      log 'Not sending latest promotion because older than today...' if post_date != today_date
      log '*** POST IS STILL AT LOCALHOST ***' if site.config['url'].include?('http://localhost:4000')
    end
  end

  private

  def truncatewords(input, length)
    truncate = input.split(' ')
    if truncate.length > length
      truncate[0..length-1].join(' ').strip + ' &hellip;'
    else
      input
    end
  end

  def generate_message(post, site)
    promotion_message = post.data['promotion'] || truncatewords(post.content, 120)
    "#{promotion_message} #{site.config['url']}#{post.url}"
  end

  def most_recent_post(site)
    site.posts.reduce do |memo, post|
      memo.date > post.date ? memo : post
    end
  end

  def buffer(message, site)

    access_token = ENV['BUFFER_ACCESS_TOKEN'] || read_access_token(site.config['buffer']['config'])
    fail ArgumentError, 'No Buffer access token!' unless access_token
    client = Buff::Client.new(access_token)
    prof_ids = read_profile_ids(site.config['buffer']['config'])
    content = { body: { text: message, top: true, shorten: true,
                        profile_ids: prof_ids } }
    if site.config['buffer']['share']
      response = client.create_update(content)
      log("Buffer API Response: #{response.inspect}")
    else
      log 'Not sending latest post promotion to Buffer...'
    end
  end

  def read_access_token(file)
    return nil unless File.exist?(file)
    content = YAML.load_file(file)
    return content['buffer']['access_token']
  end
  def read_profile_ids(file)
    return nil unless File.exist?(file)
    content = YAML.load_file(file)
    return content['buffer']['profile_ids']
  end

  def log(message)
    puts "\n\n#{message}\n\n"
  end
end
