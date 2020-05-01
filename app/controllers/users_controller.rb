class UsersController < ApplicationController
	before_action :logged_in_user, only: [:show]
	before_action :correct_user, only: [:show]

	def new
		@user = User.new
	end

	def create
		@user = User.new(user_params)
		if @user.save
			log_in @user
    	redirect_to opinions_path
		else
			 render 'new'
		end
	end

	def show
		@user = current_user
		@opinions = Opinion.all
	end

	private
	  def user_params
    	params.require(:user).permit(:name, :username, :email, :location, :avatar)
    end

    # Confirms the correct user.
    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end
end
