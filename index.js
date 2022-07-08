import Discord from 'discord.js';
import axios from 'axios';

const token = "Bot token goes here";

const client = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
});
const channel = "Channel ID goes here";

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
})



const calculateCollection = async (symbol, name, detectedItems) => {

    try{
        
        const floorItemsResponse = await axios.get(`https://api-mainnet.magiceden.dev/v2/collections/${symbol}/listings?offset=0&limit=5&sort=price`);

        
        if(floorItemsResponse.status>=400){
            return;
        }
    
        const floorItems = floorItemsResponse.data;
    
        if(floorItems[0]?.price < floorItems[1]?.price*90/100){
            if(!detectedItems.some(element=>(element.tokenMint===floorItems[0]?.tokenMint && element.price === floorItems[0]?.price))){
                let howCheap = (100 - (floorItems[0].price/floorItems[1].price*100)).toFixed(2);
                let message = `**Collection: ${name}** \nFloor Before: ${floorItems[1]?.price} \nNew Listed: ${floorItems[0]?.price} **(%${howCheap}) cheaper** than floor. \n` + 
                `Rarity: ${floorItems[0]?.rarity?.moonrank?.rank} \n\n` + `https://magiceden.io/item-details/${floorItems[0]?.tokenMint} `;
                client.channels.cache.get(channel).send(message);
                detectedItems.push({tokenMint: floorItems[0]?.tokenMint, price: floorItems[0]?.price});
            }
    
        }
    }
    catch(error){
        console.log(error);
        await new Promise(resolve=>{
            setTimeout(()=>{
                console.log("61 saniye")
                resolve();
            },61000)
        })
    }

}




const main = async () => {
    const collectionNames = ["Cope Town", "Degods","Trippin Ape Tribe","Quantum Traders","Cets on Creck", "Blocksmith Labs", "Communi3", "Solgods",
    "Pengsol", "Atadians", "Shadowy Super Coder Dao", "The Catalina Whale Mixer", "Solstein", "Stoned Ape Crew", "Bohemia", "Thugbirdz",
    "Famous Fox Federation", "Smokeheads", "Solana Monkey Business", "Taiyo Robotics", "Soldecoder", "Transdimensional Fox Federation",
    "Halo Bulls", "Delysid Kiddos", "Primates", "Okay Bears", "Degentown", "Pesky Penguins", "Degenerate Ape Academy", "Galactic Geckos",
    "Boogle gen 1", "Aurory", "Lotus Gang", "Great Goats", "Rarikeys", "Ghost Kid Dao", "Solful", "Exomon", "Dead Rejects",
    "Bubblegoose Ballers", "Boryoku Dragonz", "Doge Capital", "Justape", "Vandal City", "Art of MOB", "Udder Chaos", "Jikan Studios", "Suteki", 
    "Communi3_Labs",  "Sphynx Underground Society", "Drippies", "Zoonies", "Carton Kids", "The Remnants",
    "Soltoolsxyz", "Sol Cli", "Cubistnft", "Grim Syndicate", "Cat Cartel", "Cyber Frogs", "Myths of Myrien", "Smart Sea Society",
    "Moonly", "DYOR Nerds"];

    const collectionSymbols = ["copetown", "degods","trippin_ape_tribe","quantum_traders","cets_on_creck", "blocksmith_labs", "communi3", "solgods",
    "pengsol", "atadians", "shadowy_super_coder_dao", "the_catalina_whale_mixer", "solstein", "stoned_ape_crew", "bohemia_", "thugbirdz",
    "famous_fox_federation", "smokeheads", "solana_monkey_business", "taiyo_robotics", "soldecoder", "transdimensional_fox_federation",
    "halo_bulls", "delysid_kiddos", "primates", "okay_bears", "degentown", "pesky_penguins", "degenerate_ape_academy", "galactic_geckos",
    "boogle_gen_1", "aurory", "lotus_gang_nft", "great__goats", "rarikeys", "ghost_kid_dao", "solful", "exomon", "dead_rejects",
    "bubblegoose_ballers", "boryoku_dragonz", "doge_capital", "justape", "vandal_city", "art_of_mob", "udder_chaos", "jikan", "suteki", 
    "communi3_labs",  "sphynx_underground_society", "drippies", "zoonies", "carton_kids", "the_remnants_",
    "soltoolsxyz", "sol_cli", "cubistnft", "grim_syndicate", "cat_cartel", "cyber_frogs", "mythsofmyrien", "smart_sea_society",
    "moonly", "dyor_nerds"];

    const detectedItems = [];

    setInterval(()=>{detectedItems=[]},36000000);

    console.log("main calsiti");


    for(;;){
        for(let i=0;i<collectionSymbols.length;i++){
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    resolve(calculateCollection(collectionSymbols[i], collectionNames[i], detectedItems));}, 650);
            });
        }
    }

}


main();


client.login(token);