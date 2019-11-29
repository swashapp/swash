import {utils} from '../../../js/utils.js'

describe('utils', function() {
    describe('arrayRemove', function() {
        it('remove item from array', function() {
			let arr = [1,2,'test',4]
			
			arr = utils.arrayRemove(arr, 'test')
            expect(arr[2]).toEqual(4);
        });
	});
	
	describe('uuid', function() {
        it('generate a random uuid', function() {
            expect(utils.uuid()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        });
	});
	
	describe('serialize', function() {
        it('Serialize object properties', function() {
			let obj = {
				param1: 'test1',
				param2: 'test2',
				param3: 'test3'
			}
            expect(utils.serialize(obj)).toEqual("param1=test1&param2=test2&param3=test3");
        });
		
		it('Serialize and encode object properties', function() {
			let obj = {
				param1: 'test 1',
				param2: 'test/2',
				param3: 'test3'
			}
            expect(utils.serialize(obj)).toEqual("param1=test%201&param2=test%2F2&param3=test3");
        });
	});
	
	
	describe('wildcard matching', function() {
        it('Matched case', function() {
			let wc = "*://www.test.*"
			let input = "https://www.test.org"
            expect(utils.wildcard(input, wc)).toEqual(input);
        });
		
		 it('Not matched case', function() {
			let wc = "*://www.test.*"
			let input = "https://test.org"
            expect(utils.wildcard(input, wc)).toNotEqual(input);
        });
	});
	
	describe('isEmpty', function() {
        it('Null value', function() {
			let val = null						
            expect(utils.isEmpty(val)).toEqual(true);
        });
		
		it('Zero length string', function() {
			let val = ""						
            expect(utils.isEmpty(val)).toEqual(true);
        });
		
		it('Zer length array', function() {
			let val = []						
            expect(utils.isEmpty(val)).toEqual(true);
        });
		
		it('Object with no property', function() {
			let val = {}						
            expect(utils.isEmpty(val)).toEqual(true);
        });
	});
	
	describe('jsonUpdate', function() {
        it('Update existed properties', function() {
			let src = {
				prop1: {
					val: 10
				}
			}
			
			let newObject = {
				prop1: {
					val: 20
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val).toEqual(20);
        });
		
		it('Update not existed simple properties', function() {
			let src = {
				prop1: {					
				}
			}
			
			let newObject = {
				prop1: {
					val: 20
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val).toEqual(20);
        });
		
		it('Update not existed object properties', function() {
			let src = {				
			}
			
			let newObject = {
				prop1: {
					val: 20
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val).toEqual(20);
        });
		
		it('Update not existed array properties', function() {
			let src = {	
				prop1: {					
				}
			}
			
			let newObject = {
				prop1: {
					val: [10, 20]
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val[1]).toEqual(20);
        });
		
		it('Update existed array properties', function() {
			let src = {	
				prop1: {
					val: [50, 60]
				}
			}
			
			let newObject = {
				prop1: {
					val: [10, 20]
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val[1]).toEqual(20);
        });
		
		it('Update existed but different array properties', function() {
			let src = {	
				prop1: {
					val: [50, 60]
				}
			}
			
			let newObject = {
				prop1: {
					val: [10, 20]
				}				
			}
			utils.jsonUpdate(src, newObject)
            expect(src.prop1.val[1]).toEqual(20);
        });
	});
});