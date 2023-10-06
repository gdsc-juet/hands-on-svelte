import type { PageLoad } from "./$types";

export const load = (() => {
    // you can get this data from ANY SOURCE
    // fetch call here
    // graphql client
    // manually change this object here whenever you want

    return {
        srcCode: [
            {
				contestName: "Codeforces Round #74 ",
				codingPlatform: "CodeForces",
				problemId: "Template",
				code: `/*-----------------------WORK HARD THINK HARD-----------------------*/

/*
                Codeforces:- 
                Codechef  :- 
*/

#include <bits/stdc++.h>

/*----------------------------PBDS----------------------------------*/
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

using namespace std;
using namespace __gnu_pbds;

typedef tree<int, null_type, less<int>, rb_tree_tag, tree_order_statistics_node_update> pbds;

/*------------------------------TYPES------------------------------*/
#define int long long
#define pii pair<int, int>
#define pll pair<long long, long long>
#define vi vector<int>
#define vs vector<string>
#define vc vector<char>
#define vll vector<long long>
#define mii map<int, int>
#define si set<int>
#define sc set<char>

/*------------------------------FUNCTIONS------------------------------*/
#define forn(i, n) for (i = 0; i < n; i++)
#define forse(i, s, e) for (int i = s; i < e; i++)
#define fores(i, e, s) for (int i = e - 1; i >= s; i--)

#define pb push_back
#define mp make_pair
#define eb emplace_back
#define setbits(x) __builtin_popcountll(x)
#define zrobits(x) __builtin_ctzll(x)
#define be(v) v.begin(), v.end()
#define rbe(v) v.rbegin(), v.rend()
#define sz(a) a.size()
#define MOD 1000000007
#define inf 1e18
#define sp(x, y) fixed << setprecision(y) << x

#define mid(s, e) (s + (e - s) / 2)
#define toUpper(x) transform(x.begin(), x.end(), x.begin(), toupper)
#define toLower(x) transform(x.begin(), x.end(), x.begin(), tolower)
/*----------------------------------------------------------------*/
#define ios ios_base::sync_with_stdio(0), cin.tie(0), cout.tie(0)
#define srand srand(chrono::high_resolution_clock::now().time_since_epoch().count())

/*------------------------------MATH------------------------------*/
#define sqr(n) (n * n)
#define PI 3.1415926535897932384626433832795

/*------------------------------Extras------------------------------*/
#define null NULL
#define endl '\n'
#define imi INT_MIN
#define imx INT_MAX
#define ff first
#define ss second
#define inputarr(arr,n) for(int i = 0 ; i < n ; i++) cin>>arr[i]
#define printarr(arr,n) for(int i = 0 ; i < n ; i++) cout<<arr[i]<<" "
#define loop(i,n) for(int i = 0 ; i < n ; i++)

// string checkVowel(string s, int pos ){
//     if(s[k] == 'A' || s[k]=='E' || s[k]=='I' || s[k]=='O' || s[k]=='U' || s[k]=='Y'
//          || s[k]=='a' || s[k]=='e' || s[k]=='i' || s[k]=='o' || s[k]=='u' || s[k]=='y'){
//              return "YES";
//          }
//      else return "NO";
// }






void siu(){
  int n; cin>>n;
  vi arr(n);
  inputarr(arr,n);
    
    
}
signed main()
{
  ios;
  int t = 1;
  //cin >> t;
  while (t--)
  {
    siu();
    
  }

  return 0;
}`,
				starred: false
			},
			
        ]
    }
}) satisfies PageLoad; // PageLoad -> PageData (in our frontend)