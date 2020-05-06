module OpinionsHelper
	 def liked?(opinion_id)
    current_user.likes.exists?(opinion_id: opinion_id)
  end

  # Gets Like Id of a particular post liked by a current user
  def current_user_liked(opinion_id)
    current_user.likes.find_by(opinion_id: opinion_id).id
  end
end
