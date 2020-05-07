RSpec.describe Opinion, type: :model do

  context 'validation test' do
    it 'ensures opinion cannot have empty content' do
      opinion = Opinion.new(text:'').save
      expect(opinion).to eq(false)
    end

   end


 end