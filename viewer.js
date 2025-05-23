$(document).ready(function () {
	const baseUrl = "https://alphalibraryweb.github.io/database/betas/";
	const iconBaseUrl = "img/";

	// Updated list with categories and versions
	const categories = {
		"Windows": [{
			display_name: "Windows 1.0",
			save_name: "win1"
		},
		{
			display_name: "Windows 2.x",
			save_name: "win2"
		},
		{
			display_name: "Windows 3.0",
			save_name: "win3"
		},
		{
			display_name: "Windows 3.1x",
			save_name: "win31"
		},
		{
			display_name: "Windows 95",
			save_name: "win95"
		},
		{
			display_name: "Windows 98",
			save_name: "win98"
		},
		{
			display_name: "Windows 2000",
			save_name: "win2000"
		},
		{
			display_name: "Windows ME",
			save_name: "winme"
		},
		{
			display_name: "Windows XP",
			save_name: "winxp"
		},
		{
			display_name: "Windows Vista",
			save_name: "winvista"
		},
		{
			display_name: "Windows 7",
			save_name: "win7"
		},
		{
			display_name: "Windows 8",
			save_name: "win8"
		},
		{
			display_name: "Windows 8.1",
			save_name: "win81"
		},
		{
			display_name: "Windows 10 (Original Release)",
			save_name: "win10_original"
		},
		{
			display_name: "Windows 11 (Original Release)",
			save_name: "win11_original"
		}
		],
		"Windows (unreleased)": [{
			display_name: "Windows Nashville",
			save_name: "winnashville"
		},
		{
			display_name: "Windows Neptune",
			save_name: "winneptune"
		},
		{
			display_name: "Windows 10X",
			save_name: "win10x"
		}
		],
		"Windows Insider": [{
			display_name: "Cobalt",
			save_name: "cobalt"
		},
		{
			display_name: "Nickel",
			save_name: "nickel"
		}
		],
		"Community Windows Versions": [{
			display_name: "OpenXP",
			save_name: "openxp"
		},
		{
			display_name: "Open11",
			save_name: "open11"
		},
		{
			display_name: "OpenNT 5",
			save_name: "opennt5"
		},
		{
			display_name: "Windows 7 SP2",
			save_name: "win7sp2"
		}]
	};

	// Populate the categories dropdown
	function populateCategoryDropdown() {
		const $categoryDropdown = $('#category-selector');
		$categoryDropdown.empty(); // Clear previous options

		Object.keys(categories).forEach(category => {
			const iconUrl = `${iconBaseUrl}category/${category.toLowerCase().replace(/\s+/g, '_')}.png`;
			console.log(iconUrl); // Log the icon URL for debugging

			// Create the option element
			const option = $('<option>')
				.val(category)
				.text(category);

			// Append the option to the dropdown
			$categoryDropdown.append(option);
		});

		// Trigger the versions dropdown population when a category is selected
		$categoryDropdown.on('change', function () {
			const selectedCategory = $(this).val();
			populateVersionDropdown(categories[selectedCategory]);
		});
		// Trigger the initial population
		$categoryDropdown.on('change', function () {
			const selectedCategory = $(this).val();
			const iconUrl = `${iconBaseUrl}category/${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.png`;
			$(this).css('background-image', `url('${iconUrl}')`);
		});
		$categoryDropdown.trigger('change');
	}

	// Populate the versions dropdown based on selected category
	function populateVersionDropdown(versions) {
		const $dropdown = $('#beta-selector');
		$dropdown.empty(); // Clear previous options

		versions.forEach(version => {
			const option = $('<option>')
				.val(version.save_name)
				.text(version.display_name)
				.css('background-image', `url('${iconBaseUrl}${version.save_name}.png')`)
				.css('background-repeat', 'no-repeat')
				.css('background-position', '10px center')
				.css('padding-left', '40px');
			$dropdown.append(option);
		});

		// Set the default icon for the selected option
		$dropdown.on('change', function () {
			const selectedVersion = $(this).find('option:selected').val();
			const iconUrl = `url('${iconBaseUrl}os/${selectedVersion}.png')`;
			$(this).css('background-image', iconUrl);
		});

		// Trigger the initial change to set the default icon
		$dropdown.trigger('change');
	}

	// Fetch and display the selected beta builds
	function loadBetaBuilds(saveName) {
		const fileUrl = `${baseUrl}${saveName}.json`;
		$('#build-list').empty(); // Clear the table content before loading new data

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

	// Preferred download link order and services with country icons
	function getPreferredDownloadLink(downloads) {
		const order = ["internetarchive", "terabox", "pixeldrain", "googledrive", "proton", "onedrive", "mega"];
		for (const key of order) {
			if (downloads[key]) return {
				service: key,
				link: downloads[key]
			};
		}
		return null;
	}

	function getCountryIcon(service) {
		switch (service) {
			case 'internetarchive':
			case 'googledrive':
			case 'onedrive':
				return '\u{1F1FA}\u{1F1F8}'; // USA icon
			case 'mega':
				return '\u{1F1F3}\u{1F1FF}'; // NZ icon
			case 'protondrive':
				return '\u{1F1E8}\u{1F1ED}'; // Switzerland icon
			case 'terabox':
				return '\u{1F1EF}\u{1F1F5}';
			case 'pixeldrain':
				return '\u{1F1EB}\u{1F1EE}';
			default:
				return '';
		}
	}

	function getDisplayName(service) {
		switch (service) {
			case 'internetarchive':
				return 'Internet Archive';
			case 'googledrive':
				return 'Google Drive';
			case 'onedrive':
				return 'OneDrive';
			case 'mega':
				return 'Mega.nz';
			case 'protondrive':
				return 'Proton Drive';
			case 'terabox':
				return 'TeraBox';
			case 'pixeldrain':
				return 'Pixeldrain';
			default:
				return service;
		}
	}

	function displayDownloadOptions(downloads) {
		let content = '';
		const groupedDownloads = {
			standard: [], // For services without variants
			variants: {} // For services with variants
		};

		// Step 1: Group downloads by standard vs variants
		for (const key in downloads) {
			const [baseService, variant] = key.split('-');

			// If there's a variant, group it under the variants section
			if (variant) {
				if (!groupedDownloads.variants[variant]) {
					groupedDownloads.variants[variant] = [];
				}
				groupedDownloads.variants[variant].push({
					baseService,
					url: downloads[key]
				});
			} else {
				// Otherwise, it's a standard download (without a variant)
				groupedDownloads.standard.push({
					baseService,
					url: downloads[key]
				});
			}
		}

		// Step 2: Display standard downloads
		if (groupedDownloads.standard.length > 0) {
			groupedDownloads.standard.forEach(download => {
				const iconUrl = getCountryIcon(download.baseService);
				const displayName = getDisplayName(download.baseService);
				content += `<div><table id="dlt"><tr><td>
                <p style="width: 20px; margin-right: 10px;">${iconUrl}</p></td><td>
                <a href="${download.url}" target="_blank" class="download-btn">${displayName}</a></td></tr></table>
            </div>`;
			});
			content += "<br><hr>";
		}

		// Step 4: Display variant downloads
		for (const variant in groupedDownloads.variants) {
			content += `<h3 style='margin-bottom:0px;'>${variant}</h3>`;
			groupedDownloads.variants[variant].forEach(download => {
				const iconUrl = getCountryIcon(download.baseService);
				const displayName = getDisplayName(download.baseService);
				content += `<div><table id="dlt"><tr><td>
                <p style="width: 20px; margin-right: 10px;">${iconUrl}</p></td><td>
                <a href="${download.url}" target="_blank" class="download-btn">${displayName}</a></td></tr></table>
            </div>`;
			});
			content += "<br><hr>";
		}

		// Step 5: Inject the content into the modal and open it
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
		width: 320,
		height: 400
	});

	// Event listener for dropdown change
	$('#beta-selector').on('change', function () {
		const selectedSaveName = $(this).val();
		const selectedPage = categories[$('#category-selector').val()].find(page => page.save_name === selectedSaveName);
		if (selectedPage) {
			updateSelectedVersion(selectedPage.display_name, selectedPage.save_name);
			loadBetaBuilds(selectedPage.save_name);
		}
	});

	// Event listener for opening the modal with download options
	$(document).on('click', '.open-modal-btn', function () {
		const downloads = $(this).data('downloads');
		displayDownloadOptions(downloads);
	});

	// Initialize the dropdowns
	populateCategoryDropdown();
});
