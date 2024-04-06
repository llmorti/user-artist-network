// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "d8ba0ad0741b45fb97537156de795899";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const topTracks = await fetchTopUserTracks(accessToken);
    populateUI(profile, topTracks);
}

async function fetchProfile(code: string): Promise<SpotifyApi.UserProfileResponse> {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

async function fetchTopUserTracks(code: string): Promise<SpotifyApi.UsersTopTracksResponse> {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

function populateUI(profile: SpotifyApi.UserProfileResponse, tracks: SpotifyApi.UsersTopTracksResponse) {
    console.log(tracks)
    document.getElementById("displayName")!.innerText = profile?.display_name ?? "unknown"
    document.getElementById("id")!.innerText = profile.id
    document.getElementById("uri")!.innerText = profile.uri
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify)
    document.getElementById("url")!.innerText = profile.href
    document.getElementById("url")!.setAttribute("href", profile.href)
    document.getElementById("email")!.innerText = tracks.items[0].name
    console.log(tracks.items[0].name)
}
