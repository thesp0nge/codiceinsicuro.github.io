# The original array_to_sentence_string but with the connector localized
#
module ArrayToSentenceStringIt
  def array_to_sentence_string_it( array )
    connector = "e"
    connector_aux = "ed"

    case array.length
    when 0
      ret= ""
    when 1
      ret= array[0].to_s
    when 2
      ret = "#{array[0]} #{connector} #{array[1]}"
    else
      ret = "#{array[0...-1].join(', ')} #{connector} #{array[-1]}" unless array[-1].start_with? 'e'
      ret = "#{array[0...-1].join(', ')} #{connector_aux} #{array[-1]}" if array[-1].start_with? 'e'
    end

    ret
  end
end

Liquid::Template.register_filter(ArrayToSentenceStringIt)
