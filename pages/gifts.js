import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import React from 'react'


export default function Home() {
  // const [giftInput, setGiftInput] = useState("");

  // burdaki genderin baslangic degeri man oluyor. setGender ise bunu sonradan guncellemek icin kullandigimiz deger oluyor. usestate ayrica render konusunda oldukca hizli oldugu icin dinamikligi de artirirmis
  const [gender, setGender] = useState ('man');
  const [age, setAge] = useState (30);
  const [priceMin, setPriceMin] = useState (25);
  const [priceMax, setPriceMax] = useState (100);
  const [hobbies, setHobbies] = useState ("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });
      const data = await response.json();
      setResult(data.result.replaceAll("\n", "<br />"))
    } catch (e) {
      alert("Failed to generate gift ideas. Try later");
    } finally {
      setLoading(false);
    }
    
  }

  return (
    <div>
      <Head>
        <title>Gift Generator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
  
        <h3>GIFT GENERATOR</h3>
        <form onSubmit={onSubmit}>
          <label>Which gender is the gift for?</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            min={1}
            max={99}
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Price from</label>
          <input
            type="number"
            min={1}
            name="priceMin"
            placeholder="Enter the minimum price"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price to</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter the hobbies using ','"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />
          <input type="submit" value="Generate gift ideas" />
        </form>
        {loading && (
          <div >
            <h3>Looking for the best gift ideas...</h3>
            <img style={{display: 'flex', justifyContent: 'center'}} src="/loading.gif" width="100" height="100" className={styles.loading} />
          </div>
        )}
        <div className={styles.result} dangerouslySetInnerHTML={{ __html: result}}
        />
      </main>
    </div>
  );
}
