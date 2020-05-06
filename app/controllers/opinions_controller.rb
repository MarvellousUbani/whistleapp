class OpinionsController < ApplicationController
  before_action :opinion_owner, only: [:destroy]
  before_action :logged_in_user


  def create
    @opinion = current_user.opinions.build(opinions_params)
    @opinion.author = current_user
    if @opinion.save
      redirect_to opinions_path  
    else
      redirect_to opinions_path
    end
  end

  def index
    @opinion = Opinion.new
    @opinions = Opinion.all
    @nofollowers = User.where.not(id: current_user.followers)
  end

  def destroy
    @opinion = Opinion.find(params[:id])
    @opinion.destroy
    redirect_to opinions_path
  end

  private

  def opinions_params
    params.require(:opinion).permit(:text, :image)
  end

  def opinion_owner
    @opinion = Opinion.find(params[:id])
    redirect_to opinions_path unless current_user == @opinion.author
  end


end
