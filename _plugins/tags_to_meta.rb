# The original array_to_sentence_string but with the connector localized
#
module TagsToMeta
  def tags_to_meta( array )

    case array.length
    when 0
      ret= ""
    when 1
      ret= array[0].to_s
    else
      ret = "#{array[0...array.length].join(' ')}"
    end

    ret
  end
end

Liquid::Template.register_filter(TagsToMeta)
