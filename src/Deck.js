import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const Deck = () => {
    const deckID = useRef();
    const cardsRemaining = useRef();

    const INITIAL_STATE = [];
    const [ cards, setCards] = useState(INITIAL_STATE);

    // this is called *after* component first added to DOM
    useEffect(function getDeckOfCards() {
        async function queryForDeck() {
            const result = await axios.get(
                "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
                deckID.current = result.data.deck_id;
                cardsRemaining.current = result.data.remaining;
                console.log(cardsRemaining.current);

            }
        queryForDeck();
    }, []);

    // useEffect(function drawCard() {
        async function queryForCard() {
            if (cardsRemaining.current === 0) {
                return alert('Error: no cards remaining!');
            }
            const result = await axios.get(
                `https://deckofcardsapi.com/api/deck/${deckID.current}/draw/?count=1`);
            cardsRemaining.current = result.data.remaining;
            console.log(cardsRemaining.current);
            const { value, suit, image } = result.data.cards[0];
            const cardsPlusDraw = [...cards, { value, suit, image, key: image }];
            setCards(cardsPlusDraw);
        };
    // }, []);

    return (
        <div className='DeckContainer'>
            <button onClick={queryForCard}>Draw!</button>
            <div className='Deck'>
                {cards.map(card => <Card 
                    value={card.value}
                    suit={card.suit}
                    image={card.image}
                    key={card.image}
                />)}
            </div>
        </div>
    )
}

export default Deck;