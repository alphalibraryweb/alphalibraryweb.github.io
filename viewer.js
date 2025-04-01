$(document).ready(function () { const baseUrl = "https://alphalibraryweb.github.io/database/betas/"; const iconBaseUrl = "img/";

const categories = {
    "Windows": [
        { display_name: "Windows 1.0", save_name: "win1" },
        { display_name: "Windows 2.x", save_name: "win2" },
        { display_name: "Windows 3.0", save_name: "win3" },
        { display_name: "Windows 3.1x", save_name: "win31" },
        { display_name: "Windows 95", save_name: "win95" },
        { display_name: "Windows 98", save_name: "win98" },
        { display_name: "Windows 2000", save_name: "win2000" },
        { display_name: "Windows ME", save_name: "winme" },
        { display_name: "Windows XP", save_name: "winxp" },
        { display_name: "Windows Vista", save_name: "winvista" },
        { display_name: "Windows 7", save_name: "win7" },
        { display_name: "Windows 8", save_name: "win8" },
        { display_name: "Windows 8.1", save_name: "win81" },
        { display_name: "Windows 10 (Original Release)", save_name: "win10_original" },
        { display_name: "Windows 11 (Original Release)", save_name: "win11_original" }
    ],
    "Windows (unreleased)": [
        { display_name: "Windows Nashville", save_name: "winnashville" },
        { display_name: "Windows Neptune", save_name: "winneptune" },
        { display_name: "Windows 10X", save_name: "win10x" }
    ],
    "Windows Insider": [
        { display_name: "Cobalt", save_name: "cobalt" },
        { display_name: "Nickel", save_name: "nickel" }
    ],
    "Community Windows Versions": [
        { display_name: "OpenXP", save_name: "openxp" }
    ]
};

function populateCategoryDropdown() {
    const $categoryDropdown = $('#category-selector');
    $categoryDropdown.empty();

    Object.keys(categories).forEach(category => {
        const option = $('<option>').val(category).text(category);
        $categoryDropdown.append(option);
    });

    $categoryDropdown.on('change', function () {
        const selectedCategory = $(this).val();
        populateVersionDropdown(categories[selectedCategory]);
        const iconUrl = `${iconBaseUrl}category/${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.png`;
        $(this).css('background-image', `url('${iconUrl}')`);
    }).trigger('change');
}

function populateVersionDropdown(versions) {
    const $dropdown = $('#beta-selector');
    $dropdown.empty();

    versions.forEach(version => {
        const option = $('<option>')
            .val(version.save_name)
            .text(version.display_name)
            .css({
                'background-image': `url('${iconBaseUrl}${version.save_name}.png')`,
                'background-repeat': 'no-repeat',
                'background-position': '10px center',
                'padding-left': '40px'
            });
        $dropdown.append(option);
    });

    $dropdown.on('change', function () {
        const selectedVersion = $(this).find('option:selected').val();
        $(this).css('background-image', `url('${iconBaseUrl}os/${selectedVersion}.png')`);
    }).trigger('change');
}

function loadBetaBuilds(saveName) {
    const fileUrl = `${baseUrl}${saveName}.json`;
    $('#build-list').empty();

    $.getJSON(fileUrl, function (data) {
        data.forEach(build => {
            const downloads = build.downloads || {};
            let downloadButton = `<span>No downloads available</span>`;

            if (Object.keys(downloads).length > 0) {
                downloadButton = `<button class="open-modal-btn" data-downloads='${JSON.stringify(downloads)}'>Download</button>`;
            }

            $('#build-list').append(`
                <tr>
                    <td>${build.channel}</td>
                    <td>${build.build}</td>
                    <td>${build.compiled_date}</td>
                    <td>${downloadButton}</td>
                </tr>
            `);
        });
    });
}

function displayDownloadOptions(downloads) {
    let content = '';
    const order = ["internetarchive", "googledrive", "onedrive", "mega"];

    order.forEach(service => {
        if (downloads[service]) {
            content += `<div><table id="dlt"><tr><td>
                <p style="width: 20px; margin-right: 10px;">${getCountryIcon(service)}</p></td><td>
                <a href="${downloads[service]}" target="_blank" class="download-btn">${getDisplayName(service)}</a></td></tr></table>
            </div>`;
        }
    });

    $('#download-modal .modal-content').html(content);
    $('#download-modal').dialog("open");
}

function updateSelectedVersion(displayName, saveName) {
    $('#selected-icon').attr('src', `${iconBaseUrl}${saveName}.png`);
    $('#selected-text').text(displayName);
}

$('#download-modal').dialog({
    autoOpen: false,
    modal: true,
    width: 400,
    height: 400
});

$('#beta-selector').on('change', function () {
    const selectedSaveName = $(this).val();
    const selectedPage = categories[$('#category-selector').val()].find(page => page.save_name === selectedSaveName);
    if (selectedPage) {
        updateSelectedVersion(selectedPage.display_name, selectedPage.save_name);
        loadBetaBuilds(selectedPage.save_name);
    }
});

$(document).on('click', '.open-modal-btn', function () {
    displayDownloadOptions($(this).data('downloads'));
});

populateCategoryDropdown();

});

