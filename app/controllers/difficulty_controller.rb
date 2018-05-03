class DifficultyController < ApplicationController
    def set_difficulty
        params.require(:topic_id)
        params.require(:difficulty)