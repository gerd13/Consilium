﻿using System.Security.Claims;
using System;
using System.Linq;
using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IRepositoryWrapper _db;
        private readonly ILoggerManager _logger;
        private readonly IMapper _mapper;

        public UserController(
            IRepositoryWrapper db,
            ILoggerManager logger,
            IMapper mapper)
        {
            _db = db;
            _logger = logger;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet("email-available/{email}")]
        public IActionResult IsEmailAvailable(string email)
        {
            try
            {
                var userWithEmail = _db.User.FindByCondition(x => x.Email == email).SingleOrDefault();
                return Ok(userWithEmail == null);
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in IsEmailAvailable: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult SignIn([FromBody] AuthenticateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var token = _db.User.Authenticate(dto.Email, dto.Password);
                if (token == null)
                {
                    return BadRequest();
                }

                return Ok(token);
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in SignIn: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public IActionResult SignUp([FromBody] CreateUserDto dto)
        {
            try
            {
                if (dto == null || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var user = _mapper.Map<User>(dto);

                var createdUser = _db.User.Register(user, dto.Password);

                var response = _mapper.Map<UserDto>(createdUser);

                return Ok(response);
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in SignUp: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("current")]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var userId = HttpContext.User.FindFirst(ClaimTypes.Sid)?.Value;
                var user = _db.User.GetUserById(new Guid(userId), includePersons: true);

                return Ok(_mapper.Map<UserDto>(user));
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in GetCurrentUser: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut]
        public IActionResult UpdateGeneral([FromBody] UpdateUserGeneralDto dto)
        {
            try
            {
                if (dto == null || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var userId = HttpContext.User.FindFirst(ClaimTypes.Sid)?.Value;
                var user = _db.User.GetUserById(new Guid(userId));

                user.Email = dto.Email;

                _db.User.Update(user);
                _db.Save();

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in UpdateGeneral: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("interface")]
        public IActionResult UpdateInterface([FromBody] UpdateUserInterfaceDto dto)
        {
            try
            {
                if (dto == null || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var userId = HttpContext.User.FindFirst(ClaimTypes.Sid)?.Value;
                var user = _db.User.GetUserById(new Guid(userId));

                user.Language = dto.Language;
                user.Theme = dto.Theme;

                _db.User.Update(user);
                _db.Save();

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in UpdateInterface: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("password")]
        public IActionResult UpdatePassword([FromBody] UpdatePasswordDto dto)
        {
            try
            {
                if (dto == null || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var userId = HttpContext.User.FindFirst(ClaimTypes.Sid)?.Value;

                var success = _db.User.ChangePassword(new Guid(userId), dto.OldPassword, dto.NewPassword);
                if (success)
                {
                    return NoContent();
                }

                return BadRequest();
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in UpdateInterface: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete]
        public IActionResult DeleteUser()
        {
            try
            {
                var userId = HttpContext.User.FindFirst(ClaimTypes.Sid)?.Value;

                _db.User.Delete(new User { Id = new Guid(userId) });
                _db.Save();

                return NoContent();
            }
            catch (Exception e)
            {
                _logger.LogError($"ERROR in DeleteUser: {e.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}