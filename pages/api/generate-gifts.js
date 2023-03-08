import { Configuration, OpenAIApi } from "openai";

// OpenAI API anahtarının yapılandırılması
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// OpenAI API anahtarının yapılandırılması
const openai = new OpenAIApi(configuration);
// Sunucu tarafından alınan isteklere cevap veren fonksiyon
export default async function (req, res) {

   // Gelen istekten parametrelerin alınması
  const {priceMin = 0, priceMax = 9999, gender = '', age = '', hobbies = ''} = req.body

  const prompt = generatePrompt(priceMin, priceMax, gender, age, hobbies)

  console.log(prompt);
  // Hata kontrolleri
  if (priceMin < 0 || priceMin > priceMax) {
    res.status(400).json({
      error: {
        message: "Please enter a valid minimum price",
      }
    });
    return;
  }
  
  if (priceMax < priceMin) {
    res.status(400).json({
      error: {
        message: "Please enter a valid maximum price",
      }
    });
    return;
  }
  
  if (gender.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid gender",
      }
    });
    return;
  }
  
  if (age < 0 || age > 100) {
    res.status(400).json({
      error: {
        message: "Please enter a valid age",
      }
    });
    return;
  }
  
  if (hobbies.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid hobby",
      }
    });
    return;
  }
  
  // Bu blok, OpenAI API'si kullanarak bir metin tamamlama işlemi gerçekleştirir. try bloğunda, OpenAI API'si çağrılır ve tamamlanan metin, result özelliği ile birlikte 200 durum koduyla birlikte bir JSON yanıtına dönüştürülür ve istemciye gönderilir. catch bloğunda, herhangi bir hata durumunda hata mesajı gösterilir ve bir hata yanıtı gönderilir.
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(priceMin, priceMax, gender, age, hobbies),
      temperature: 0.6,
      max_tokens: 2048,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
// Bu fonksiyon, metin tamamlama modeline gönderilecek olan tamamlama metnini oluşturur. Bu, priceMin, priceMax, gender, age ve hobbies değişkenlerini kullanarak bir metin oluşturur.
function generatePrompt(priceMin, priceMax, gender, age, hobbies) {
  return `${priceMin}₺ ile ${priceMax}₺ 
  fiyatları arasında, ${age} yaşında bir 
  ${gender} için ${hobbies} 
  ile alakali 3 hediye öner.`
}

// TEST KODU

// curl -X POST localhost:3000/api/generate-gifts -H "Content-Type: application/json" -d '{"priceMin": 50, "priceMax": 500, "gender": "woman", "age": 23, "hobbies": "drawing, traveling, coding"}'