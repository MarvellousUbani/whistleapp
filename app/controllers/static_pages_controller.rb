class StaticPagesController < ApplicationController
  def connect
  	@nofollowers = User.where.not(id: current_user.followers)
  end

  def notifications
  end

  def about
  end

  def help
  end
end
