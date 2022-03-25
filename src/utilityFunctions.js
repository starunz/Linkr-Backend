export default function addSpaceHashtagsStuck(text){

    if(text.includes('#')){
        text = text.replace(/#/gi, ' #');
        text = text.trim();
        console.log(text);
    }
    
    return text;
}