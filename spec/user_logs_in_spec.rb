# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'User logs in', type: :feature do
  before :each do
    User.create(name: 'Mike', username: 'mike', email: 'mike@gmail.com', location: 'Lagos')
  end

  scenario 'with blank username' do
    login_with ''

    expect(page).to have_content('Log in')
  end

  scenario 'with wrong username' do
    login_with 'bolu'

    expect(page).to have_content('Log in')
  end

  scenario 'with correct username' do
    login_with 'mike'

    expect(page).to have_content('Log out')
  end


  def login_with(name)
    visit login_path
    fill_in 'session_username', with: name
    click_button 'Log in'
  end
end
