exports.formatDates = list => {
    const nuList = JSON.parse(JSON.stringify(list))
    
    nuList.forEach( item => 
        item.created_at = new Date(item.created_at));

    return nuList
};

exports.makeRefObj = list => {
    //console.log(list, '<<< list')
    const refObj = {};
    list.forEach( obj => {
        //console.log(obj, "<<< obj")
        refObj[obj.title] = obj.article_id
    })
    return refObj;
};

exports.formatComments = (comments, articleRef) => {
    const newArray = [];
    comments.forEach( comment => {
        const formattedComment = {}

        formattedComment.author = comment.created_by;
        formattedComment.article_id = articleRef[comment.belongs_to];
        formattedComment.created_at = new Date(comment.created_at);

        formattedComment.body = comment.body;
        formattedComment.votes = comment.votes
        

        newArray.push(formattedComment);
    })
    //console.log(newArray)
    return newArray
};
