
export function apiHeader() {
  let user = localStorage.getItem(`${process.env.REACT_APP_PREFIX}_USER`);
  if(user) {
    user = JSON.parse(user);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.accessToken}`
    };
  } else {
    return { 'Content-Type': 'application/json' };
  }
}

export function apiHeaderFormData(){
  let user = localStorage.getItem(`${process.env.REACT_APP_PREFIX}_USER`);
  if(user) {
    user = JSON.parse(user);
    return {
      'Authorization': `Bearer ${process.env.REACT_APP_CDN_PUBLIC_KEY}`
    };
  } else {
    return {};
  }
}

export function contentXForm() {
  return {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}