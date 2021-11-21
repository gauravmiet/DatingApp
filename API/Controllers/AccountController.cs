using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _TokenService;
        public AccountController(DataContext context,ITokenService TokenService)
        {
            _TokenService = TokenService;
            _context = context;

        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>>Register(RegisterDto registerDto)
        {
            if(await UserExist(registerDto.Username)) 
               return BadRequest("User is taken");
            using var hmac=new HMACSHA512();
            var user =new AppUser()
            {
                UserName=registerDto.Username,
                PasswordHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt=hmac.Key
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            // return user;
            return new UserDto{Username=user.UserName,Token=_TokenService.CreateToken(user)};
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>>Login(LoginDto loginDto)
        {
             var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName==loginDto.Username);
             if (user==null) 
             return Unauthorized("Invalid UserName");

             using var hmac=new HMACSHA512(user.PasswordSalt);
             var computedHash=hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
             for(int i=0;i<computedHash.Length;i++)
             {
               if(computedHash[i] != user.PasswordHash[i])
               {
                   return Unauthorized("Invalid Password");
               }
             }
            //  return user;
            return new UserDto
            {
                Username=user.UserName,
                Token=_TokenService.CreateToken(user)
            };
        }
        private async Task<bool>UserExist(string username)
        {
           return await _context.Users.AnyAsync(x=>x.UserName==username.ToLower());
           
        }
    }
}