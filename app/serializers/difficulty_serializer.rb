class DifficultyController < ApplicationSerializer
    attributes :id,
               :title,
               :url,
               :topic_id,
               :difficulty

    def url
        object.relative_url
    end
end