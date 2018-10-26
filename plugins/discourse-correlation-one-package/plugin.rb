# name: DiscourseCorrelationOnePackage
# about:
# version: 0.1
# authors: ehliang
# url: https://github.com/ehliang


register_asset "stylesheets/common/discourse-correlation-one-package.scss"


enabled_site_setting :discourse_correlation_one_package_enabled

PLUGIN_NAME ||= "DiscourseCorrelationOnePackage".freeze

after_initialize do
  
  # see lib/plugin/instance.rb for the methods available in this context
  

  module ::DiscourseCorrelationOnePackage
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace DiscourseCorrelationOnePackage
    end
  end

  

  
  require_dependency "application_controller"
  class DiscourseCorrelationOnePackage::ActionsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    before_action :ensure_logged_in

    def list
      render json: success_json
    end
  end

  DiscourseCorrelationOnePackage::Engine.routes.draw do
    get "/list" => "actions#list"
  end

  Discourse::Application.routes.append do
    mount ::DiscourseCorrelationOnePackage::Engine, at: "/discourse-correlation-one-package"
  end
  
end
