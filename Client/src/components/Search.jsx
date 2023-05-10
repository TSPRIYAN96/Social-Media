import React, {useRef, useState} from 'react'
import SmartText from './SmartText';
import { useNavigate } from 'react-router-dom';

const Search = () => {

    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const inputRef = useRef();
    const navigate = useNavigate();

    const adoptSearchResult = (value) => {
        setSearch(value);
        inputRef.current.value = value;
    }


    const searchHandler = async(target) => {
        if(target.value.length && (target.value[0] === '@' || target.value[0] === '&')){
            target.style.color = target.value[0] === '@' ?  '#02F798' : '#e76306';
            if(target.value.length > 1){
                
                const res = await fetch(`http://localhost:3000/api/search/${target.value}`, {
                    method : 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                });
                const data = await res.json();
                setSearchResults(structuredClone(data.results));
                
            }
            setSearch(target.value);

        }else{
            target.style.color = 'white';
            setSearchResults([]);
            setSearch(target.value);
        }
    }

    return (
        <div className='w-1/3 max-w-[500px] m-3'>
            {/* <Input type={"text"} defaultValue={"Search for names with an @ and groups with &"} title="" handler={searchHandler}/> */}
            <form   autocomplete="off"
                    onSubmit={(e) => {
                    e.preventDefault();
                    // console.log(`${location.href.split('/').slice(0, 3).join('/')}/${search[0] === '@' ? 'user' : (search[0] === '&' ? 'group' : '')}/${search.slice(1,)}`);
                     location.href = `/${search[0] === '@' ? 'user' : (search[0] === '&' ? 'group' : '')}/${search.slice(1,)}`;
                }}>
                <input
                    ref={inputRef}
                    type="text"
                    spellCheck="false"
                    placeholder={"Search for names with an @ and groups with &"}
                    name={"search"}
                    className = 'font-semibold  px-3 py-1 h-fit rounded-2xl border-solid border-2 border-themecolor w-full'
                    onChange={(e) => {searchHandler(e.target)}}
                />
            </form>
            <div className='m-auto flex flex-col w-full bg-bglight rounded-t-xl rounded-b-lg'>
                {searchResults ? searchResults.map((result, id) => 
                    <div key={id} className='w-full px-3 py-1 text-left hover:bg-[#383737]' onClick={() => {adoptSearchResult(result.search_result)}}>
                        <SmartText text={result.search_result} rerender={searchResults}/>
                    </div>)
                : (search.length ? <span className='p-2'>No results found</span> : <></>)}
            </div>
        </div>
    )
}

export default Search