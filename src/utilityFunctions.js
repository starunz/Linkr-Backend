export default function addSpaceHashtagsStuck(text){

    if(text.includes('#')){
        text = text.replace(/#/gi, ' #');
        text = text.replace(/# /gi, '');
        text = text.replace(/\s{2,}/g, ' ');
        text = text.trim();
    }
    
    return text;
}