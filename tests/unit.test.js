const analyzeText =require('../public/analyzer')
const app = require("../index")

describe("testing numbers",()=>{
    it("should should throw error; not string",()=>{
        expect(()=>analyzeText(122)).toThrow();
    })
    it("should return true if text contain numbers",()=>{
        expect(analyzeText("123").hasNumbers).toBeTruthy();
    })
})

describe("testing text length",()=>{
    it("should should return lenght of string",()=>{
        x=analyzeText("hello")
        expect(x.length).toBe(5);
    })
    it("should return true if text contains numbers",()=>{
        expect(analyzeText("123").hasNumbers).toBeTruthy();
    })
})

describe("testing converting text to array",()=>{
    it('should return how many words',()=>{
        x=analyzeText("software engineering is a cs subject")
        expect(x.words.length).toBe(6)
    })
    it('should return if a word is in the list or not',()=>{
        x=analyzeText("software engineering is a cs subject")
        expect(x.words).toContain('cs')
    })
    /*** array testing  */
    it('should return list of word',()=>{
        x=analyzeText("Hello world 123")
      expect(x.words).toEqual(["Hello", "world", "123"])

    })
    it('should return empty list if no text ',()=>{
        x=analyzeText("")
      expect(x.words).toEqual([])

    })
   
})

describe("testing IsEmpty",()=>{
    it('should return True if there no is a text',()=>{
        x=analyzeText("")
        expect(x.isEmpty).toBeTruthy()
    })
    it('should return false if there is a text',()=>{
        x=analyzeText("software engineering is a cs subject")
        expect(x.isEmpty).toBeFalsy()
    })
})

describe("testing as object",()=>{
    it('should return true if objects match',()=>{
        x=analyzeText('hello 123');
        y={
            length:9,
            hasNumbers:true,
            isEmpty:false,
            words:['hello','123']
        }
        expect(x).toEqual(y)
    })
    it('should return if it match this property',()=>{
        x=analyzeText('hello 123');
        expect(x).toHaveProperty('length',9)
    })
})
