$(document).ready(function () {
    const baseUrl = "https://betawebproject.github.io/database/betas/";
    const iconBaseUrl = "img/";

    // Updated list with display names and save_name for JSON file access
    const versions = [
        { display_name: "Windows 1.0", save_name: "win1" },
        { display_name: "Windows 2.x", save_name: "win2" },
        { display_name: "Windows 3.0", save_name: "win3" },
        { display_name: "Windows 3.1x", save_name: "win31" },
        { display_name: "Windows 95", save_name: "win95" },
        { display_name: "Windows 98", save_name: "win98" },
        { display_name: "Windows 2000", save_name: "win2000" },
        { display_name: "Windows ME", save_name: "winme" },
        { display_name: "Windows Neptune", save_name: "winneptune" },
        { display_name: "Windows XP", save_name: "winxp" },
        { display_name: "Windows Vista", save_name: "winvista" },
        { display_name: "Windows 7", save_name: "win7" },
        { display_name: "Windows 8", save_name: "win8" },
        { display_name: "Windows 8.1", save_name: "win81" },
        { display_name: "Windows 10 (Original Release)", save_name: "win10_original" },
        { display_name: "Windows 11 (Original Release)", save_name: "win11_original" }
    ];

    // Populate the dropdown with icons and display names

    function populateDropdown() {
        const $dropdown = $('#beta-selector');

        versions.forEach(version => {
            const option = $('<option>')
                .val(version.save_name)
                .text(version.display_name)
                .css('background-image', `url('img/${version.save_name}.png')`)
                .css('background-repeat', 'no-repeat')
                .css('background-position', '10px center')
                .css('padding-left', '40px');
            $dropdown.append(option);
        });

        // Set the default icon for the selected option
        $dropdown.on('change', function () {
            const selectedVersion = $(this).find('option:selected').val();
            const iconUrl = `url('img/${selectedVersion}.png')`;
            $(this).css('background-image', iconUrl);
        });

        // Trigger the initial change to set the default icon
        $dropdown.trigger('change');
    }

    $(document).ready(function () {
        populateDropdown();
    });

    // Fetch and display the selected beta builds
    function loadBetaBuilds(saveName) {
        const fileUrl = `${baseUrl}${saveName}.json`;
        $('#build-list').empty(); // Clear the table content before loading new data

        $.getJSON(fileUrl, function (data) {
            data.forEach(build => {
                const downloads = build.downloads || {};
                let downloadContent = `<span>No downloads available</span>`;
                let moreOptions = ``;

                if (Object.keys(downloads).length > 0) {
                    const preferredDownload = getPreferredDownloadLink(downloads);
                    if (preferredDownload) {
                        downloadContent = `<a href="${preferredDownload.link}" class="download-btn" target="_blank">${preferredDownload.service}</a>`;
                    }

                    moreOptions = `<br><span class="more-options-btn" data-downloads='${JSON.stringify(downloads)}'>Other Downloads</span>`;
                }

                $('#build-list').append(`
                    <tr>
                        <td>${build.channel}</td>
                        <td>${build.build}</td>
                        <td>${build.compiled_date}</td>
                        <td>${downloadContent} ${moreOptions}</td>
                    </tr>
                `);
            });
        });
    }

    function getPreferredDownloadLink(downloads) {
        const order = ["internetarchive", "googledrive", "onedrive", "mega"];
        for (const key of order) {
            if (downloads[key]) return { service: key, link: downloads[key] };
        }
        return null;
    }

    function displayDownloadOptions(downloads) {
        let content = '<ul>';
        for (const service in downloads) {
            if (downloads[service]) {
                content += `<li><a href="${downloads[service]}" target="_blank">${service}</a></li>`;
            }
        }
        content += '</ul>';
        $('#download-modal .modal-content').html(content);
        $('#download-modal').dialog("open");
    }

    // Update the selected version display with icon and text
    function updateSelectedVersion(displayName, saveName) {
        const iconUrl = `${iconBaseUrl}${saveName}.png`;
        $('#selected-icon').attr('src', iconUrl);
        $('#selected-text').text(displayName);
    }

    // Initialize jQuery UI Dialog
    $('#download-modal').dialog({
        autoOpen: false,
        modal: true,
        width: 400
    });

    // Event listener for dropdown change
    $('#beta-selector').on('change', function () {
        const selectedSaveName = $(this).val();
        const selectedPage = versions.find(page => page.save_name === selectedSaveName);
        if (selectedPage) {
            updateSelectedVersion(selectedPage.display_name, selectedPage.save_name);
            loadBetaBuilds(selectedPage.save_name);
        }
    });

    // Event listener for more download options
    $(document).on('click', '.more-options-btn', function () {
        const downloads = $(this).data('downloads');
        displayDownloadOptions(downloads);
    });
});
