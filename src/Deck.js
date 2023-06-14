import React, { useEffect, useRef, useState} from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const Deck = () => {
    const deckID = useRef();
    const cardsRemaining = useRef();
    const timerID = useRef();

    const INITIAL_STATE = [];
    const [ cards, setCards ] = useState(INITIAL_STATE);

    const [ isDrawing, setIsDrawing ] = useState(false);

    // this is called *after* component first added to DOM
    useEffect(function getDeckOfCards() {
        async function queryForDeck() {
            const result = await axios.get(
                "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
                deckID.current = result.data.deck_id;
                cardsRemaining.current = result.data.remaining;
            }
        queryForDeck();
    }, []);

    /* Draw one card every second if autoDraw is true */
    useEffect(() => {
        /* Draw a card via API, add card to state "drawn" list */
        async function getCard() {

            const result = await axios.get(`https://deckofcardsapi.com/api/deck/${deckID.current}/draw/`);

            cardsRemaining.current = result.data.remaining;
            if (cardsRemaining.current === 0) {
                setIsDrawing(false);
            }
            const { value, suit, image } = result.data.cards[0];
            setCards(cards => [
                ...cards,
                {
                value, suit, image, key: image
                }
            ]);
        }

        if (isDrawing && !timerID.current) {
            timerID.current = setInterval(async () => {
            await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerID.current);
            timerID.current = null;
        };
    }, [isDrawing, setIsDrawing, cards]);

    const toggle = () => {
        if (cardsRemaining.current !== 0) {
            setIsDrawing(current => !current);
        }
        else {
            alert('No cards remaining!')
        }
    };

    return (
        <div className='DeckContainer'>
            <button onClick={toggle}>
                {isDrawing ? "Stop Drawing" : "Start Drawing"}
            </button>
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