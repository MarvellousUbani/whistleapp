# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User create opinions', type: :feature do
  before :each do
    User.create(name: 'Mike', username: 'mike', email: 'mike@gmail.com', location: 'Lagos')
  end

  scenario 'has opinion button' do
    login_with 'mike'
    visit opinions_path
    expect(page).to have_content('Whistle')
  end

  scenario 'has incorrect log_in details' do
    login_with 'bolu'
    expect(page).to have_content('New user? Sign up now!')
  end

  def login_with(name)
    visit login_path
    fill_in 'session_username', with: name
    click_button 'Log in'
  end
end
