exports.formatDates = list => {
    const nuList = JSON.parse(JSON.stringify(list))
    
    nuList.forEach( item => 
        item.created_at = new Date(item.created_at));

    return nuList
};

exports.makeRefObj = list => {
    return {};
};

exports.formatComments = (comments, articleRef) => {};
