##
# The MIT License (MIT)
# 
# Copyright (c) 2019 Paolo Perego
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
# 
# 
# Tag to create a CVE Microsoft portal CVE
#
# Example:
#    {% ms_cve CVE-2019-12345 %}

module Jekyll
  class MsCveLink < Liquid::Tag

    def render(context)
      if tag_contents = determine_arguments(@markup.strip)
        cve = tag_contents[0]

        cve_tag(cve)

      else
        raise ArgumentError.new <<-eos
Syntax error in tag 'ms_cve' while parsing the following markup:

  #{@markup}

Valid syntax:
  {% ms_cve CVE-2019-12345 %}
eos
      end
    end

    private

    def determine_arguments(input)
      matched = input.match(/\A(\S+)?\Z/)
      [matched[1].to_s.strip] if matched && matched.length >= 2
    end

    def cve_tag(cve)
      "<a href=\"https://portal.msrc.microsoft.com/en-US/security-guidance/advisory/#{cve}\">#{cve}</a>"
    end
  end
end

Liquid::Template.register_tag('ms_cve', Jekyll::MsCveLink)
