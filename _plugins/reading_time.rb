# Outputs the reading time
#
# # Read this in “about 4 minutes”
# # Put into your _plugins dir in your Jekyll site
# # Usage: Read this in about {{ page.content | reading_time }}
#
module ReadingTime
  def reading_time( input )
    words_per_minute = 180
    words = input.split.size;
    minutes = ( words / words_per_minute ).floor
    minutes_label = minutes === 1 ? " minuto" : " minuti"
    minutes > 0 ? "circa #{minutes} #{minutes_label}" : "meno di 1 minuto"
  end
end

Liquid::Template.register_filter(ReadingTime)
