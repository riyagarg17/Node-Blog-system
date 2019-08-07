const moment = require('moment');

module.exports = {
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            var new_str = str + " ";
            new_str = str.substr(0, len);
            new_str = str.substr(0, new_str.lastIndexOf(" "));
            new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
            return new_str + '...';
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
    },
    editIcon: function (storyUser, loggedUser, storyId, show = true) {
        if (storyUser == loggedUser) {
           if (show == true) {
                return `
                <div class="row justify-content-center"> 
                    <div class="col-2">
                        <a class="btn btn-primary" href="/stories/edit/${storyId}"> <i class="fa fa-pencil"> </i> </a>
                    </div> 
                    <div class="col-2">
                        <form action="/stories/delete/${storyId}?_method=DELETE" method="post" id="delete-form">
                            <input type="hidden" name="_method" value="DELETE">
                            <button class="btn btn-danger"> <i class="fa fa-remove"></i></button>
                        </form>
                    </div>
                </div>`;
            } else {
                return `
                        <a class="btn btn-primary edit" href="/stories/edit/${storyId}"> <i class="fa fa-pencil"> </i> </a>
                        <form action="/stories/delete/${storyId}?_method=DELETE" method="post" id="delete-form">
                            <input type="hidden" name="_method" value="DELETE">
                            <button class="btn btn-danger"> <i class="fa fa-remove"></i></button>
                        </form> `;
            }

        } else {
            return '';
        }
    }
};