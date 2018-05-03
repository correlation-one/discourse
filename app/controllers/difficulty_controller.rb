class DifficultyController < ApplicationController
    def set_difficulty
        params.require(:topic_id)
        params.require(:difficulty)

       topic = Topic.find(params[:topic_id].to_i)
       topic.custom_fields["difficulty"] = params[:difficulty].to_i
       topic.save_custom_fields(true)

       #render json (??)
    end