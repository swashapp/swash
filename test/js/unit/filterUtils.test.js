import {filterUtils} from '../../../js/filterUtils.js'

describe('filterUtils', function() {    
	describe('filter', function() {
        it('Exact filtering: expect filter', function() {
			let input = "https://swashapp.io"
			let filters = [{type: "exact", value: "https://swashapp.io"}]
            expect(filterUtils.filter(input, filters)).toEqual(true);
        });
		
		it('Exact filtering: expect not filter', function() {
			let input = "https://swashapp.io/"
			let filters = [{type: "exact", value: "https://swashapp.io"}]
            expect(filterUtils.filter(input, filters)).toEqual(false);
        });
		
		it('Wildcard filtering: expect filter', function() {
			let input = "https://swashapp.io"
			let filters = [{type: "wildcard", value: "*://swashapp.*"}]
            expect(filterUtils.filter(input, filters)).toEqual(true);
        });
		
		it('Wildcard filtering: expect not filter', function() {
			let input = "https://www.swashapp.io"
			let filters = [{type: "wildcard", value: "*://swashapp.*"}]
            expect(filterUtils.filter(input, filters)).toEqual(false);
        });
		
		it('Regex filtering: expect filter', function() {
			let input = "https://swashapp.io"
			let filters = [{type: "regex", value: "https?:\/\/swash.*\.(io|net|org)"}]
            expect(filterUtils.filter(input, filters)).toEqual(true);
        });
		
		it('Regex filtering: expect not filter', function() {
			let input = "https://swashapp.com"
			let filters = [{type: "regex", value: "https?:\/\/swash.*\.(io|net|org)"}]
            expect(filterUtils.filter(input, filters)).toEqual(false);
        });			
	});
});