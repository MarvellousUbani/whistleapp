Rails.application.routes.draw do
  get '/connect', to: 'static_pages#connect'
  get '/notifications', to: 'static_pages#notifications'
  get '/about', to: 'static_pages#about'
  get 'help', to: 'static_pages#help'

  resources :likes, only: [:create, :destroy]
  resources :followings, only: [:create, :destroy]
  resources :opinions, only: [:index, :create, :destroy]
  resources :users

  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'opinions#index'
  get '/signup/' ,to: 'users#new' 
  get '/login', to: 'sessions#new'
	post 'login', to: 'sessions#create'
	delete '/logout', to: 'sessions#destroy'
	
end