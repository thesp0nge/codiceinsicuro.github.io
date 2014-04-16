# The original array_to_sentence_string but with the connector localized
#
module ArrayToSentenceStringIt
  def array_to_sentence_string_it( array )
    connector = "e"
    connector_aux = "ed"

    case array.length
    when 0
      ""
    when 1
      array[0].to_s
    when 2
      "#{array[0]} #{connector} #{array[1]}"
    else
      "#{array[0...-1].join(', ')}, #{connector} #{array[-1]}" unless array[-1].start_with? 'e'
      "#{array[0...-1].join(', ')}, #{connector_aux} #{array[-1]}" if array[-1].start_with? 'e'
    end
  end
end

Liquid::Template.register_filter(ArrayToSentenceStringIt)
