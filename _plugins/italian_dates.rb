require 'time'
module Jekyll
    module ItalianDates
        MONTHS = {"01" => "gennaio", "02" => "febbraio", "03" => "marzo",
                "04" => "aprile", "05" => "maggio", "06" => "giugno",
                "07" => "luglio", "08" => "agosto", "09" => "settembre",
                "10" => "ottobre", "11" => "novembre", "12" => "dicembre"}
        S_MONTHS = {"01" => "gen", "02" => "feb", "03" => "mar",
                "04" => "apr", "05" => "mag", "06" => "giu",
                "07" => "lug", "08" => "ago", "09" => "set",
                "10" => "ott", "11" => "nov", "12" => "dic"}

        def italian_short_date(date)
          day = date.strftime("%e") # leading zero is replaced by a space
          month = date.strftime("%m")
          year = date.strftime("%Y")
          day+' '+S_MONTHS[month]+' '+year

        end

        # http://man7.org/linux/man-pages/man3/strftime.3.html
        def italian_date(date)
          day = date.strftime("%e") # leading zero is replaced by a space
          month = date.strftime("%m")
          year = date.strftime("%Y")
          day+' '+MONTHS[month]+' '+year
        end

        def html5date(date)
          day = date.strftime("%d")
          month = date.strftime("%m")
          year = date.strftime("%Y")
          year+'-'+month+'-'+day
        end
    end
end

Liquid::Template.register_filter(Jekyll::ItalianDates)
