import React, { useState, useEffect } from "react";
import StyledComponents from "styled-components";
import Select from 'react-select';

/**
 * Styles
 */
const Layout = StyledComponents.div`
    display: grid;
    grid-template-columns: 20% 60% 20%;
    margin-top: 5em;
`;

const MainContent = StyledComponents.div`
    display: grid;
`;

const GreetingContainer = StyledComponents.div`
    width: 100%;
    display: flex;
    padding-bottom: 20px;
`;
const GreetingText = StyledComponents.div`
    padding: 10px;
    font-size: 200%;
`;

const ButtonsRow = StyledComponents.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
`;

const ActionButton = StyledComponents.button`
    padding: 18px;
    margin: 5px;
    height: 50px;
    border-radius: 10px;
    border-style: none;
    outline: none;
    background-color: ${/* istanbul ignore next*/ ({hasData}) => hasData ? "#404040" : "#cccccc"};
    color: white;
    font-size: 100%;
    font-weight: bold;
    width: calc(50% / 3);
    cursor: ${/* istanbul ignore next*/ ({hasData}) => hasData ? "pointer" : "default"};
`;

const SearchActionButton = StyledComponents.button`
    padding: 10px;
    margin: 5px;
    height: 50px;
    border-radius: 10px;
    border-style: none;
    outline: none;
    background-color: #404040;
    color: white;
    font-size: 100%;
    font-weight: bold;
    width: calc(50% / 3);
    cursor: pointer;
`;

const ActionMessageContainer = StyledComponents.div`
    display: flex;
    justify-content: center;
`;
const ActionMessage = StyledComponents.div`
    margin: 18px;
    padding: 15px 0;
    height: 30px;
    border-radius: 10px;
    border-style: none;
    background: #efebeb;
    color: #929292;
    font-size: 120%;
    font-weight: bold;
    width: calc(100% - 20px);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ActionMessageText = StyledComponents.div``;

const SearchRow = StyledComponents.div`
    position: relative;
    margin: 10px 0;
    height: 100px;
    display: flex;
    justify-content: space-between;
`;

const SearchContainer = StyledComponents.div`
    width: 100%;
	height: 100%;
	position: relative;
	display: flex;
    align-items: center;
    justify-content: space-around;
`;

const SearchCriterionInput = StyledComponents.input`
    width: 20%;
    margin: 0 15px;
    background-color: #f3f3f3;
    border-radius: 5px;
    height: 40%;
    border: 0;
    outline: none;
    padding-left: 3em;
    font-size: 14px;
    font-weight: bold;
    opacity: .8;
`;

const CardContainerGrid = StyledComponents.div`
	position: relative;
	margin-top: 5em;
	height: 500px;
	background-color: #fff;
	display: grid;
	grid-template-columns: repeat(3, calc(33.34% - 1.34em));
    grid-gap: 30px 2em;
`;

const Card = StyledComponents.div`
    display: grid;
	position: relative;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr 60px;
	grid-gap: 25px auto;
	border-bottom: 1px solid #d9d8d9;
`;

const CardImageContainer = StyledComponents.div`
	position: relative;
	width: 100%;
	height: 278px;
	margin-bottom: 12px;
`;
const CardImage = StyledComponents.img`
    position: absolute;
    left:0;
    top:0;
    object-fit: contain;
    height: 100%;
    width: 100%;
`;

const HitPointContainer = StyledComponents.div`
    display: flex;
    flex-direction: row;
`;

const SelectContainer = StyledComponents.div`
    width: 100px;
`;

// Todo: move to utils
const options = [
    { value: 'eq', label: 'Equal'},
    { value: 'gt', label: 'Greater than' },
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lt', label: 'Less than' },
    { value: 'lte', label: 'Less than or equal to' }
  ]

// Todo: move to api utils
const getCardsInfo = () => {
return new Promise((resolve, reject) => {
    fetch("https://api.pokemontcg.io/v1/cards?pageSize=100") //can use axios as well
        .then((response) => {
            resolve(response.json());
        }).catch((err) => {
            reject(err);
        });
});
}

const PokemonBackup = () => {

    const [searchClicked, setSearchClicked] = useState(false);
    const [cardsData, setCardsData] = useState(null);
    const [ searchResults, setSearchResults ] = useState(null);
    const [ downloadedCounter, setDownloadedCounter ] = useState(0);
    const [ feedbackMessage, setFeedbackMessage ] = useState("Choose an option");

    useEffect(() => {
        if (downloadedCounter && cardsData && cardsData.length) {
            setFeedbackMessage("Saving to database");
            saveBackup(cardsData);
        }
    }, [downloadedCounter]);

    const saveBackup = (cards) => {
        fetch("http://localhost:5000/backups/create", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cards
            }) 
        }).then((response) => {
            setFeedbackMessage("Saved to database")
        }, (error) => {
            setFeedbackMessage("Error saving to database")
        }).catch((err) => {
            console.log("catch");
        });
    }

    const purgeBackup = () => {
        let url = "http://localhost:5000/backups/purge";
        return fetch(url, {
          method: 'DELETE'
        }).then(response => {
            setFeedbackMessage("Backup purged");
            response.json().then(json => {
                return json;
              })
            }
        );
    }

    const getSearchResults = (hitPoint, rarity, name, hitPointObject) => {
        let operator = hitPointObject.value || "eq";
        const numericHitPoint = Number(hitPoint);
       let url = `http://localhost:5000/backups/get?name=${name}&rarity=${rarity}&hp=${numericHitPoint}&op=${operator}`
       console.log(url);
        fetch(url)
        .then((res) => {
            return res.json();
        }, (error) => {
            setFeedbackMessage("Unexpected response from server");
            throw error;
        }).then((jsonResponse) => {
            console.log("success", jsonResponse);
            if (jsonResponse && jsonResponse.result && jsonResponse.result.length) {
                setFeedbackMessage("Saved to database")
                setSearchResults(jsonResponse.result);
            } else setFeedbackMessage("No results found for the search criteria.")
        }, (error) => {
            console.log("error");
            setFeedbackMessage("Error saving to database")
        }).catch((err) => {
            console.log("catch herereteyet");
        });
    }

    const searchInBackup = ({rarity, hitPoint, name, hitPointObject}) => {
        console.log(`Search for hit:${hitPoint || "null/undef"} | rarity:${rarity|| "null/undef"} | name:${name || "null/undef"}`)
        getSearchResults(hitPoint, rarity, name, hitPointObject);
    }

    const handleCreateButtonClick = () => {
        setFeedbackMessage("Getting cards data from source..")
        setSearchClicked(false);
        getCardsInfo()
            .then((response) => {
                console.log(response.cards);
                const data = response.cards;
                setCardsData(data);
                setDownloadedCounter(downloadedCounter + 1);
                setFeedbackMessage("Retrieved cards from source")
                return data;
            })
        .catch((err) => {
            console.log("catch");
            setFeedbackMessage("Error getting cards from source")
            //setError(err);
        })
        .finally(() => {
            console.log("finally");
            //setIsLoading(false);
        });

    };

    const handlePurgeButtonClick = () => {
        if(downloadedCounter === 0) {
			return;
		}
        setSearchClicked(false);
        setFeedbackMessage("Sending request to purge..");
        setDownloadedCounter(0);
        purgeBackup();
    };

    const handleSearchButtonClick = (searchCriteriaObj) => {
        setFeedbackMessage("Searching in database..");
        searchInBackup(searchCriteriaObj);
    };

    const CardsComponent = ({ cards }) => {
        if (cards && cards.length){
            return cards.map((card, idx) => <CardComponent {...card} key={`data-card-id-${idx}`}/>
            )
        }
        return null
    }
    
    // displays multiple cards
    const SearchedCards = ({ cards }) => {
        return <CardsComponent cards={cards}/>
    }

    // displays one `Card`
    const CardComponent = (props) => {
        if (props){
            return (
                    <Card>
                        <CardImageContainer>
                            <CardImage src={props.imageUrl}></CardImage>
                        </CardImageContainer>
                    </Card>
            )
        }
        return null;
    }

    const SearchActionContent = (props) => {
        const [ searchNameValue, setSearchNameValue ] = useState("");
        const [ searchHitPointValue, setSearchHitPointValue ] = useState("");
        const [ searchRarityValue, setSearchRarityValue ] = useState("");
        const [ hitPointOperator, setHitPointOperator ] = useState("eq");
        const [ hitPointLabel, setHitPointLabel] = useState("Equal");
        const [ hitPointObject, setHitPointObject] = useState({ value: 'eq', label: 'Equal'});

        const handleOperatorSelection = (option) => {
            setHitPointOperator(option.value);
            setHitPointLabel(option.label);
            setHitPointObject(option);
        }

        if (searchClicked && downloadedCounter > 0){
            return (
                <React.Fragment>
                <SearchRow>
                    <SearchContainer>
                        <SearchCriterionInput
                            key={`search-by-name`}
                            placeholder={"type name.."}
                            value={searchNameValue}
                            onChange={(e) => {setSearchNameValue(e.target.value)}}
                        />
                        <HitPointContainer>
                            <div>
                                Hit point:
                            </div>
                            <SelectContainer>
                                <Select 
                                    options={options}
                                    onChange={handleOperatorSelection}
                                    value={hitPointObject}
                                    label={hitPointObject}
                                />
                            </SelectContainer>
                            <SearchCriterionInput 
                                key={`search-by-hitpoint`}
                                placeholder={"100"}
                                value={searchHitPointValue}
                                onChange={(e) => {setSearchHitPointValue(e.target.value)}}
                            />
                        </HitPointContainer>
                        <SearchCriterionInput 
                            key={`search-by-rarity`}
                            placeholder={"type rarity.."}
                            value={searchRarityValue}
                            onChange={(e) => {setSearchRarityValue(e.target.value)}}
                        />
                    </SearchContainer>
                </SearchRow>
                <ButtonsRow>
                    <SearchActionButton
                        key={`do-search`}
                        onClick={() => handleSearchButtonClick({
                            rarity: searchRarityValue,
                            hitPoint: searchHitPointValue,
                            name: searchNameValue,
                            hitPointObject
                        })}
                    >
                        Search
                    </SearchActionButton>
                    <SearchActionButton
                        key={`do-clear-inputs`}
                        onClick={() => {
                            setSearchRarityValue("");
                            setSearchHitPointValue("");
                            setSearchNameValue("");
                        }}
                    >
                        Clear
                    </SearchActionButton>
                </ButtonsRow>
                <CardContainerGrid>
                    <SearchedCards cards={props.searchResults}/>
                </CardContainerGrid>
            </React.Fragment>
            );
        }
        return null;
    }
    
    return (
        <Layout>
            <div/>
            <MainContent>
                <GreetingContainer>
                    <GreetingText>{"Pokemon Backup"}</GreetingText>
                </GreetingContainer>
                <ActionMessageContainer>
                    <ActionMessage>
                        <ActionMessageText>{feedbackMessage}</ActionMessageText>
                    </ActionMessage>
                </ActionMessageContainer>
                <ButtonsRow>
                    <ActionButton hasData={true}
                        onClick={() => handleCreateButtonClick()}
                    >
                        Create Backup
                    </ActionButton>
                    <ActionButton hasData={downloadedCounter}
                        disabled={downloadedCounter > 1}
                        onClick={() => handlePurgeButtonClick()}
                    >
                        Purge Backup
                    </ActionButton>
                    <ActionButton hasData={downloadedCounter}
                        onClick={() => {
                            if(downloadedCounter === 0) {
                                return;
                            }
                            setSearchClicked(true)
                            setFeedbackMessage("Enter search criteria");
                        }}
                    >
                        Search Backup
                    </ActionButton>
                </ButtonsRow>

                <SearchActionContent 
                    searchResults={searchResults} 
                />
            </MainContent>
        </Layout>
    );
}

export default PokemonBackup;